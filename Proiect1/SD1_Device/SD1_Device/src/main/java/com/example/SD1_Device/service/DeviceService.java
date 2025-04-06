package com.example.SD1_Device.service;

import com.example.SD1_Device.dto.DeviceDTO;
import com.example.SD1_Device.dto.DeviceData;
import com.example.SD1_Device.dto.PutDeleteDTO;
import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.Device;
import com.example.SD1_Device.model.User;
import com.example.SD1_Device.repository.DeviceRepository;
import com.example.SD1_Device.repository.UserRepository;
import com.example.SD1_Device.serviceInterface.DeviceServiceInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeviceService implements DeviceServiceInterface {
    private DeviceRepository repo;
    private UserRepository userRepo;
    public DeviceService(DeviceRepository deviceRepository,UserRepository userRepository){
        this.repo = deviceRepository;
        this.userRepo = userRepository;
    }
    @Override
    public Device insertDevice(DeviceDTO deviceDTO) {
        Device device = new Device();
        User user = this.userRepo.findByClient(Long.valueOf(deviceDTO.getUserId()));
        if(user != null){
            System.out.println("111");
            device.setAddress(deviceDTO.getAddress());
            device.setConsumption(Integer.valueOf(deviceDTO.getConsumption()));
            device.setDescription(deviceDTO.getDescription());
            device.setUser(user);
            repo.save(device);
            DeviceData deviceData = new DeviceData();
            deviceData.setDeviceId(device.getId());
            deviceData.setUserId(device.getUser().getClient());
            deviceData.setMaxHourlyConsumption(Double.valueOf(device.getConsumption()));
            this.publishUpdateMessage(deviceData,"device.change.create");
        }
        return device;
    }

    @Override
    public List<Device> findByUser(UserDTO userDTO) {
        User user = this.userRepo.findByClient(userDTO.getUserId());
        List<Device> devices = new ArrayList<>();
        if(user != null){
            devices = this.repo.findByUser(user);
        }
        return devices;
    }

    @Override
    public List<Device> findAll() {
        return this.repo.findAll();
    }

    @Override
    public Device updateDevice(PutDeleteDTO putDeleteDTO) {
        Device device = new Device();
        User user = this.userRepo.findByClient(Long.valueOf(putDeleteDTO.getUserId()));
        if(user != null){
            device.setUser(user);
            device.setAddress(putDeleteDTO.getAddress());
            device.setConsumption(Integer.valueOf(putDeleteDTO.getConsumption()));
            device.setDescription(putDeleteDTO.getDescription());
            device.setId(putDeleteDTO.getDeviceID());
            DeviceData deviceData = new DeviceData();
            deviceData.setDeviceId(device.getId());
            deviceData.setUserId(device.getUser().getClient());
            deviceData.setMaxHourlyConsumption(Double.valueOf(device.getConsumption()));
            this.publishUpdateMessage(deviceData,"device.change.update");
            this.repo.save(device);
        }
        return device;
    }

    @Override
    public Device deleteDevice(PutDeleteDTO putDeleteDTO) {
        Device device = new Device();
        User user = this.userRepo.findByClient(Long.valueOf(putDeleteDTO.getUserId()));
        if(user != null){
            device.setUser(user);
            device.setAddress(putDeleteDTO.getAddress());
            device.setConsumption(Integer.valueOf(putDeleteDTO.getConsumption()));
            device.setDescription(putDeleteDTO.getDescription());
            device.setId(putDeleteDTO.getDeviceID());
            DeviceData deviceData = new DeviceData();
            deviceData.setDeviceId(device.getId());
            deviceData.setUserId(device.getUser().getClient());
            deviceData.setMaxHourlyConsumption(Double.valueOf(device.getConsumption()));
            this.publishUpdateMessage(deviceData,"device.change.delete");
            this.repo.delete(device);
        }
        return device;
    }

    private void publishUpdateMessage(DeviceData device,String routingKey) {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq");
        factory.setUsername("simulator");
        factory.setPassword("simulator");

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.exchangeDeclare("device-exchange", "topic", true);

            ObjectMapper objectMapper = new ObjectMapper();
            String message = objectMapper.writeValueAsString(device);

            channel.basicPublish("device-exchange", routingKey, null, message.getBytes("UTF-8"));
            System.out.println("Mesaj trimis");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Eroare la trimiterea mesajului în RabbitMQ.");
        }
    }
}
