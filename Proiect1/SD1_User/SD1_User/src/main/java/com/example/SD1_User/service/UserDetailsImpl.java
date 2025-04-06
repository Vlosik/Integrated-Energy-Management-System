package com.example.SD1_User.service;

import com.example.SD1_User.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsImpl implements UserDetailsService {
    private UserRepository repository;
    public UserDetailsImpl(UserRepository repository){
        this.repository = repository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) {
        return this.repository.findByUsername(username);
    }
}
