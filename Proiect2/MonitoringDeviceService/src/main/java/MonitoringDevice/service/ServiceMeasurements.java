package MonitoringDevice.service;

import MonitoringDevice.controller.WebSocketController;
import MonitoringDevice.data.Message;
import MonitoringDevice.dto.CalendarDTO;
import MonitoringDevice.dto.GraphicData;
import MonitoringDevice.model.Measurements;
import MonitoringDevice.repository.MeasurementsRepository;
import MonitoringDevice.serviceInterface.MeasurementsServiceInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceMeasurements implements MeasurementsServiceInterface {
    private MeasurementsRepository repo;
    private ServiceDevices devices;
    private WebSocketController socket;

    public ServiceMeasurements(MeasurementsRepository measurementsRepository,ServiceDevices serviceDevices,WebSocketController webSocketController){
        this.repo = measurementsRepository;
        this.devices = serviceDevices;
        this.socket = webSocketController;
    }

    @Override
    @RabbitListener(queues = "Measurements")
    public void receiveMessage(String message){
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Message receivedMessage = objectMapper.readValue(message, Message.class);

            System.out.println(receivedMessage.getTimestamp() + "/" + receivedMessage.getDeviceId() + "/" + receivedMessage.getMeasurementValue());

            this.insertMeasurement(receivedMessage);
        } catch (Exception e) {
        }
    }

    @Override
    public void insertMeasurement(Message message) {
        if(message != null){
            Measurements measurements = new Measurements();
            measurements.setData(message.getTimestamp());
            measurements.setDeviceId(Long.valueOf(message.getDeviceId()));
            measurements.setMeasurement(message.getMeasurementValue());
            this.repo.save(measurements);
            this.checkConsumption(measurements);
        }
    }

    public void checkConsumption(Measurements measurements){
        Double maxHourly = this.devices.findByDeviceId(measurements.getDeviceId()).getMaxHourlyConsumption();
        Long userId = this.devices.findByDeviceId(measurements.getDeviceId()).getUserId();
        List<Measurements> measurementsList = this.repo.findByDeviceId(measurements.getDeviceId());
        LocalDate date = measurements.getData().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        List<Measurements> measurementsCurrentDay = new ArrayList<>();
        for(Measurements measurement : measurementsList){
            LocalDate timestampDate = measurement.getData().toLocalDateTime().toLocalDate();
            if(timestampDate.equals(date)){
                measurementsCurrentDay.add(measurement);
            }
        }
        if (measurementsList.size() > 4) {
            List<Measurements> lastFive = measurementsList.subList(measurementsList.size() - 5, measurementsList.size());
            Double average = measurements.getMeasurement();
            for(Measurements measurement : lastFive){
                average += measurement.getMeasurement();
            }
            Double averageValue = average / 6;
            if(averageValue > maxHourly){
                String formatted = String.format("%.3f", averageValue);
                String message = userId + "/Consumul a depășit limita maximă: " + formatted + " pentru device-ul cu id-ul: " + measurements.getDeviceId();
                System.out.println(message);
                socket.sendNotification(message);
            }
        }
    }

    @Override
    public List<GraphicData> getMeasurementsByDayAndDevice(CalendarDTO calendarDTO) {
        System.out.println(calendarDTO.getDay() + "/" + calendarDTO.getDeviceId());
        List<Measurements> measurements = this.repo.findByDeviceId(calendarDTO.getDeviceId());
        LocalDate date = calendarDTO.getDay().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        List<Measurements> measurementsCurrentDay = new ArrayList<>();
        for(Measurements measurement : measurements){
            LocalDate timestampDate = measurement.getData().toLocalDateTime().toLocalDate();
            if(timestampDate.equals(date)){
                measurementsCurrentDay.add(measurement);
            }
        }
        for(Measurements measurements1 : measurementsCurrentDay){
            System.out.println(measurements1.getDeviceId() + "/" + measurements1.getData() + "/" + measurements1);
        }
        return this.getGraphicData(measurementsCurrentDay);
    }

    public List<GraphicData> getGraphicData(List<Measurements> measurements){
        List<GraphicData> data = new ArrayList<>();
        int counter = 0;
        Double average = 0.0;
        int hour = 0;
        for(Measurements measurement : measurements){
            counter++;
            average += measurement.getMeasurement();
            if(counter == 6){
                Double value = average / 6;
                counter = 0;
                average = 0.0;
                GraphicData graphicData = new GraphicData();
                graphicData.setData(String.valueOf(hour));
                graphicData.setConsumption(value);
                data.add(graphicData);
                hour++;
            }
        }
        if(counter != 0){
            Double value = average / counter;
            GraphicData graphicData = new GraphicData();
            graphicData.setData(String.valueOf(hour));
            graphicData.setConsumption(value);
            data.add(graphicData);
        }
        System.out.println("Final");
        for(GraphicData graphicData : data){
            System.out.println(graphicData.getData() + "/" + graphicData.getConsumption());
        }
        return data;
    }

    @Override
    public void deleteAllByDeviceId(Long deviceId) {
        List<Measurements> measurements = this.repo.findByDeviceId(deviceId);
        this.repo.deleteAll(measurements);
    }

}
