package com.example.SD1_Device.repository;

import com.example.SD1_Device.model.Device;
import com.example.SD1_Device.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device,Long> {
    List<Device> findByUser(User user);
}
