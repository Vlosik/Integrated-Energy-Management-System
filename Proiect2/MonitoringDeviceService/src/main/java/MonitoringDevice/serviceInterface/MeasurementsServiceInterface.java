package MonitoringDevice.serviceInterface;

import MonitoringDevice.data.Message;
import MonitoringDevice.dto.CalendarDTO;
import MonitoringDevice.dto.GraphicData;

import java.util.List;

public interface MeasurementsServiceInterface {
    public void receiveMessage(String message);
    public void insertMeasurement(Message message);

    public List<GraphicData> getMeasurementsByDayAndDevice(CalendarDTO calendarDTO);
    public void deleteAllByDeviceId(Long deviceId);
}
