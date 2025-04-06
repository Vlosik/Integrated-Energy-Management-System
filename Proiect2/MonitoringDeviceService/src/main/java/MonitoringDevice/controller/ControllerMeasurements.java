package MonitoringDevice.controller;

import MonitoringDevice.dto.CalendarDTO;
import MonitoringDevice.dto.GraphicData;
import MonitoringDevice.service.ServiceMeasurements;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/measurements")
public class ControllerMeasurements {
    private ServiceMeasurements service;

    public ControllerMeasurements(ServiceMeasurements serviceMeasurements){
        this.service = serviceMeasurements;
    }

    @PostMapping("/getDatas")
    public List<GraphicData> getValueForGraphic(@RequestBody CalendarDTO calendarDTO){
        return this.service.getMeasurementsByDayAndDevice(calendarDTO);
    }
}
