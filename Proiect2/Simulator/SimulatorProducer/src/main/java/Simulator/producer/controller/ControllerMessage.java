package Simulator.producer.controller;

import Simulator.producer.data.DeviceState;
import Simulator.producer.service.ServiceMessage;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/producer")
public class ControllerMessage {
    private ServiceMessage service;

    public ControllerMessage(ServiceMessage service){
        this.service = service;
    }

    @PostMapping("/activate")
    public void SendDeviceId(@RequestBody DeviceState deviceState){
        this.service.activateMessages(deviceState);
    }

    @PostMapping("/deactivate")
    public void StopDevice(@RequestBody DeviceState deviceState){
        this.service.stopMessages(deviceState);
    }
}
