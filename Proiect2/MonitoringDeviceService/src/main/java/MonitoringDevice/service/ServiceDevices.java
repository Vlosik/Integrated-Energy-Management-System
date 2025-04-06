package MonitoringDevice.service;

import MonitoringDevice.data.DeviceExchange;
import MonitoringDevice.model.Devices;
import MonitoringDevice.repository.DevicesRepository;
import MonitoringDevice.serviceInterface.DevicesServiceInterface;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
public class ServiceDevices implements DevicesServiceInterface {
    private DevicesRepository repo;

    public ServiceDevices(DevicesRepository devicesRepository){
        this.repo = devicesRepository;
    }

    @Override
    @RabbitListener(queues = "device-queue",ackMode = "AUTO")
    public void receiveDevice(@Payload String message, @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        try {
            System.out.println("Mesaj primit: " + message + " cu routingKey: " + routingKey);
            ObjectMapper objectMapper = new ObjectMapper();
            DeviceExchange deviceExchange = objectMapper.readValue(message,DeviceExchange.class);

            switch (routingKey) {
                case "device.change.create":
                    this.insertDevice(deviceExchange);
                    break;
                case "device.change.update":
                    this.updateDevice(deviceExchange);
                    break;
                case "device.change.delete":
                    this.deleteDevice(deviceExchange);
                    break;
                default:
                    System.out.println("Operatie necunoscuta: " + routingKey);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void insertDevice(DeviceExchange deviceExchange) {
        if(deviceExchange != null){
            try{
                Devices device = new Devices();
                device.setDeviceId(deviceExchange.getDeviceId());
                device.setUserId(deviceExchange.getUserId());
                device.setMaxHourlyConsumption(deviceExchange.getMaxHourlyConsumption());
                this.repo.save(device);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    @Override
    public void updateDevice(DeviceExchange deviceExchange) {
        Devices device = this.repo.findByDeviceId(deviceExchange.getDeviceId());
        if(device != null){
            device.setUserId(deviceExchange.getUserId());
            device.setMaxHourlyConsumption(deviceExchange.getMaxHourlyConsumption());
            this.repo.save(device);
        }
    }

    @Override
    public void deleteDevice(DeviceExchange deviceExchange) {
        Devices device = this.repo.findByDeviceId(deviceExchange.getDeviceId());
        if(device != null){
            this.repo.delete(device);
        }
    }
    @Override
    public Devices findByDeviceId(Long DeviceId) {
        return this.repo.findByDeviceId(DeviceId);
    }
}
