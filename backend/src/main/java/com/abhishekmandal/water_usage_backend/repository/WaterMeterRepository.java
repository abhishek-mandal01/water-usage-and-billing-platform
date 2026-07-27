package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.WaterMeter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterMeterRepository extends JpaRepository<WaterMeter, Long> {
    java.util.List<WaterMeter> findByHouseholdApartmentCommunityAdminId(Long adminId);
    java.util.Optional<WaterMeter> findByHouseholdId(Long householdId);
}
