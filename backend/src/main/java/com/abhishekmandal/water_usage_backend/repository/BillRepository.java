package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUserId(Long userId);
    List<Bill> findByUserIdAndStatusOrderByBillingCycleDesc(Long userId, String status);
    java.util.Optional<Bill> findByUserIdAndBillingCycle(Long userId, String billingCycle);
    List<Bill> findByUserIdInOrderByIdDesc(List<Long> userIds);
}
