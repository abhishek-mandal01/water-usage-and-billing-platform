package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.BillingCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {
    List<BillingCycle> findByApartmentIdOrderByIdDesc(Long apartmentId);
}
