package com.example.SD1_User.service;

import com.example.SD1_User.dto.*;
import com.example.SD1_User.model.Role;
import com.example.SD1_User.model.User;
import com.example.SD1_User.repository.UserRepository;
import com.example.SD1_User.response.AuthenticationResponse;
import com.example.SD1_User.serviceInterface.UserServiceInterface;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserServiceInterface {
    private UserRepository repo;
    private RestTemplate restTemplate;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    public UserService(UserRepository userRepository,RestTemplate restTemplate,JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager){
        this.repo = userRepository;
        this.restTemplate = restTemplate;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }
    @Override
    public AuthenticationResponse insertUser(User userDTO) {
        String url = "http://device:8081/device/user/insert";
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setRole(userDTO.getRole());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        repo.save(user);
        if(userDTO.getRole() == Role.valueOf("CLIENT")){
            User userUrl = this.findByUsername(userDTO.getUsername());
            IdDTO idDTO = new IdDTO();
            idDTO.setUserId(userUrl.getId());
            System.out.println(idDTO.getUserId());
            restTemplate.postForObject(url,idDTO,String.class);
        }

        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }

    @Override
    public User findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public long getUsernameID(DeleteDTO deleteDTO){
        return findByUsername(deleteDTO.getUsername()).getId();
    }

    @Override
    public User updateUser(UpdateDTO updateDTO) {
        User user = new User();
        if(updateDTO != null){
            user.setId(updateDTO.getId());
            user.setUsername(updateDTO.getUsername());
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
            user.setRole(updateDTO.getRole());
            user.setEmail(updateDTO.getEmail());
            this.repo.save(user);
        }
        return user;
    }

    @Override
    public List<User> findAllUsers() {
        List<User> userList = this.repo.findAll();
        List<User> users = new ArrayList<>();
        for(User user : userList){
            if(user.getRole() == Role.valueOf("CLIENT")){
                users.add(user);
            }
        }
        return users;
    }

    @Override
    public User deleteUser(DeleteDTO deleteDTO) {
        String url = "http://device:8081/device/user/delete";
        User user = this.findByUsername(deleteDTO.getUsername());
        if(user != null){
            this.repo.delete(user);
            IdDTO idDTO = new IdDTO();
            idDTO.setUserId(user.getId());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<IdDTO> request = new HttpEntity<>(idDTO, headers);

            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
        }
        return user;
    }

    @Override
    public AuthenticationResponse login(User request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));
        User user = this.findByUsername(request.getUsername());
        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }
}
