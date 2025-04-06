package MonitoringDevice.serviceInterface;

import MonitoringDevice.data.DeviceExchange;
import MonitoringDevice.model.Devices;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;

public interface DevicesServiceInterface {
    void receiveDevice(@Payload String message, @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey);
    void insertDevice(DeviceExchange deviceExchange);
    void updateDevice(DeviceExchange deviceExchange);
    void deleteDevice(DeviceExchange deviceExchange);

    Devices findByDeviceId(Long DeviceId);
}
