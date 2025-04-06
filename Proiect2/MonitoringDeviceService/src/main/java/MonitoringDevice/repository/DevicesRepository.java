package MonitoringDevice.repository;

import MonitoringDevice.model.Devices;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DevicesRepository extends JpaRepository<Devices,Long> {
    Devices findByDeviceId(Long deviceId);
}
