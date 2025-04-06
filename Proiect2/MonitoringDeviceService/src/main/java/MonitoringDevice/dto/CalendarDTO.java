package MonitoringDevice.dto;

import java.util.Date;

public class CalendarDTO {
    private Date day;
    private Long deviceId;

    public Date getDay() {
        return day;
    }

    public void setDay(Date day) {
        this.day = day;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }
}
