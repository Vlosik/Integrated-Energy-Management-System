package com.example.SD1_Device.service;

import com.example.SD1_Device.dto.PutDeleteDTO;
import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.Device;
import com.example.SD1_Device.model.User;
import com.example.SD1_Device.repository.DeviceRepository;
import com.example.SD1_Device.repository.UserRepository;
import com.example.SD1_Device.serviceInterface.UserServiceInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserServiceInterface {
    private UserRepository repo;
    private DeviceRepository deviceRepo;
    private DeviceService deviceService;
    public UserService(UserRepository userRepository,DeviceRepository deviceRepository,DeviceService deviceService){
        this.repo = userRepository;
        this.deviceRepo = deviceRepository;
        this.deviceService = deviceService;
    }


    @Override
    public User addUser(UserDTO userDTO) {
        User user = new User();
        user.setClient(userDTO.getUserId());
        System.out.println(user.getClient());
        this.repo.save(user);
        return user;
    }

    @Override
    public User deleteUser(UserDTO userDTO) {
        System.out.println(55);
        User user = this.repo.findByClient(userDTO.getUserId());
        if(user != null){
            List<Device> devices = this.deviceRepo.findByUser(user);
            for(Device device : devices){
                PutDeleteDTO deleteDTO = new PutDeleteDTO();
                deleteDTO.setUserId(String.valueOf(device.getUser().getClient()));
                deleteDTO.setConsumption(String.valueOf(device.getConsumption()));
                deleteDTO.setAddress(device.getAddress());
                deleteDTO.setDeviceID(device.getId());
                deleteDTO.setDescription(device.getDescription());
                this.deviceService.deleteDevice(deleteDTO);
            }
            this.repo.delete(user);
        }
        return user;
    }

}
