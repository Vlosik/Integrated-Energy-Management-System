package Simulator.producer.service;

import Simulator.producer.data.DeviceState;
import Simulator.producer.data.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.TimeoutException;

@Service
public class ServiceMessage {
    private List<Double> measurements;
    private Map<String,Integer> devices;

    public ServiceMessage(){
        this.measurements = new ArrayList<>();
        this.devices = new HashMap<>();
    }

    public void activateMessages(DeviceState device){
        System.out.println("Simularea a inceput pentru device-ul : " + device.getId());
        this.devices.put(device.getId(), 0);
        this.readCsv();
    }

    public void stopMessages(DeviceState device){
        System.out.println("Simularea s-a oprit pentru device-ul : " + device.getId());
        this.devices.remove(device.getId());
    }

    public void readCsv(){
        String path = "/app/config/sensor.csv";
        try {
            List<String> lines = Files.readAllLines(Paths.get(path));
            for(String line : lines){
                this.measurements.add(Double.parseDouble(line));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Scheduled(fixedRate = 1000)
    public void sendMessages(){
        for(Map.Entry<String,Integer> entry : this.devices.entrySet()){
            String deviceId = entry.getKey();
            Integer counter = entry.getValue();
            Date date = new Date();
            Message message = new Message();
            message.setDeviceId(deviceId);
            message.setTimestamp(new Timestamp(date.getTime()));
            int randomNum = (int)(Math.random() * 41);
            message.setMeasurementValue(this.measurements.get(randomNum));

            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost("rabbitmq");
            factory.setUsername("simulator");
            factory.setPassword("simulator");

            try(Connection connection = factory.newConnection();
                Channel channel = connection.createChannel()) {
                counter = counter + 1;
                channel.queueDeclare("Measurements", false, false, false, null);

                ObjectMapper objectMapper = new ObjectMapper();
                String queueMessage = objectMapper.writeValueAsString(message);
                channel.basicPublish("", "Measurements", null, queueMessage.getBytes());
                if(counter == 144){
                    System.out.println("Simularea s-a oprit pentru device-ul : " + deviceId);
                    this.devices.remove(deviceId);
                }else{
                    this.devices.put(deviceId,counter);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (TimeoutException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
