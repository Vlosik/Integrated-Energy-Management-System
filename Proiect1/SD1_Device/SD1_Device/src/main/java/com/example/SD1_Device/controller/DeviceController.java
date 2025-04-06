package com.example.SD1_Device.controller;

import com.example.SD1_Device.dto.DeviceDTO;
import com.example.SD1_Device.dto.PutDeleteDTO;
import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.Device;
import com.example.SD1_Device.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/device")
public class DeviceController {
    private DeviceService service;
    public DeviceController(DeviceService deviceService){
        this.service = deviceService;
    }

    @PostMapping("/insert")
    public Device addDevice(@RequestBody DeviceDTO deviceDTO){
        return this.service.insertDevice(deviceDTO);
    }
    @PostMapping("/getByUser")
    public List<Device> getDevices(@RequestBody UserDTO userDTO){
        return this.service.findByUser(userDTO);
    }
    @PostMapping("/getAll")
    public List<Device> getAll(){
        return this.service.findAll();
    }
    @PutMapping("/update")
    public Device update(@RequestBody PutDeleteDTO putDeleteDTO){
        return this.service.updateDevice(putDeleteDTO);
    }
    @DeleteMapping("/delete")
    public Device delete(@RequestBody PutDeleteDTO putDeleteDTO){
        return this.service.deleteDevice(putDeleteDTO);
    }
}
