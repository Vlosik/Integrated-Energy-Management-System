package com.example.SD1_User.controller;


import com.example.SD1_User.dto.DeleteDTO;
import com.example.SD1_User.dto.LoginDTO;
import com.example.SD1_User.dto.UpdateDTO;
import com.example.SD1_User.dto.UserDTO;
import com.example.SD1_User.model.User;
import com.example.SD1_User.response.AuthenticationResponse;
import com.example.SD1_User.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService service;
    public UserController(UserService userService){
        this.service = userService;
    }

    @PostMapping("/insert")
    public AuthenticationResponse addUser(@RequestBody User userDTO){
        return this.service.insertUser(userDTO);
    }

    @DeleteMapping ("/delete")
    public User deleteUser(@RequestBody DeleteDTO deleteDTO){
        return this.service.deleteUser(deleteDTO);
    }

    @PostMapping("/login")
    public AuthenticationResponse LoginUser(@RequestBody User loginDTO){
        return this.service.login(loginDTO);
    }

    @PostMapping("/getID")
    public long GetID(@RequestBody DeleteDTO deleteDTO){
        return this.service.getUsernameID(deleteDTO);
    }

    @PostMapping("/getUsers")
    public List<User> getUsers(){
        return this.service.findAllUsers();
    }

    @PutMapping("/update")
    public User update(@RequestBody UpdateDTO updateDTO){
        return this.service.updateUser(updateDTO);
    }
}
