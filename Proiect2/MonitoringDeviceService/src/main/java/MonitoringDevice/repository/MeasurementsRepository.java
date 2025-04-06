package MonitoringDevice.repository;

import MonitoringDevice.model.Measurements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeasurementsRepository extends JpaRepository<Measurements,Long> {
    List<Measurements> findByDeviceId(Long deviceId);
}
