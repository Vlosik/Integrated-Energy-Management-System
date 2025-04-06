package com.example.SD1_Device.serviceInterface;

import com.example.SD1_Device.dto.DeviceDTO;
import com.example.SD1_Device.dto.PutDeleteDTO;
import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.Device;
import com.example.SD1_Device.model.User;

import java.util.List;

public interface DeviceServiceInterface {
    Device insertDevice(DeviceDTO deviceDTO);
    List<Device> findByUser(UserDTO userDTO);
    List<Device> findAll();
    Device updateDevice(PutDeleteDTO putDeleteDTO);
    Device deleteDevice(PutDeleteDTO putDeleteDTO);
}
