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

    // RAG: Total billed amount for a specific user
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.user.id = :userId")
    Double sumAmountByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    // RAG: Platform-wide total billed
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b")
    Double sumAllBilledAmount();

    // RAG: Total billed for an apartment's community admin
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.user.id IN (SELECT h.resident.id FROM Household h WHERE h.apartment.communityAdmin.id = :adminId AND h.resident IS NOT NULL)")
    Double sumAmountByAdminId(@org.springframework.data.repository.query.Param("adminId") Long adminId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.status = 'PAID'")
    Double sumTotalRevenue();

    List<Bill> findByUserRole(String role);
}
