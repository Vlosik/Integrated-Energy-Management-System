package com.example.SD1_Device.repository;

import com.example.SD1_Device.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
    User findByClient(Long client);
}
