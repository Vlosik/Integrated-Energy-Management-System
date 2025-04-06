package com.example.SD1_User.serviceInterface;

import com.example.SD1_User.dto.DeleteDTO;
import com.example.SD1_User.dto.LoginDTO;
import com.example.SD1_User.dto.UpdateDTO;
import com.example.SD1_User.dto.UserDTO;
import com.example.SD1_User.model.User;
import com.example.SD1_User.response.AuthenticationResponse;

import java.util.List;

public interface UserServiceInterface {
    AuthenticationResponse insertUser(User userDTO);
    User findByUsername(String username);
    User deleteUser(DeleteDTO deleteDTO);
    AuthenticationResponse login(User request);
    long getUsernameID(DeleteDTO deleteDTO);
    User updateUser(UpdateDTO updateDTO);
    List<User> findAllUsers();
}
