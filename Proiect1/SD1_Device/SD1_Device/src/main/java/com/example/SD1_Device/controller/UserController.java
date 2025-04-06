package com.example.SD1_Device.controller;

import com.example.SD1_Device.dto.UserDTO;
import com.example.SD1_Device.model.User;
import com.example.SD1_Device.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/device/user")
public class UserController {
    private UserService service;
    public UserController(UserService userService){
        this.service = userService;
    }
    @PostMapping("/insert")
    public User insertUser(@RequestBody UserDTO userDTO){
        return this.service.addUser(userDTO);
    }

    @DeleteMapping("/delete")
    public User deleteUser(@RequestBody UserDTO userDTO){
        return this.service.deleteUser(userDTO);
    }
}
