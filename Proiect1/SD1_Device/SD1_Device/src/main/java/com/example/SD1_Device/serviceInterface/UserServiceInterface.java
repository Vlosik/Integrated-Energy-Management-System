package com.example.SD1_Device.serviceInterface;

import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.User;


public interface UserServiceInterface {
    public User addUser(UserDTO userDTO);
    public User deleteUser(UserDTO userDTO);
}
