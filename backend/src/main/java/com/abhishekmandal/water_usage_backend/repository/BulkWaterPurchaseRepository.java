package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.BulkWaterPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BulkWaterPurchaseRepository extends JpaRepository<BulkWaterPurchase, Long> {
    List<BulkWaterPurchase> findByApartmentId(Long apartmentId);
    List<BulkWaterPurchase> findByApartmentIdAndPurchaseDateBetween(Long apartmentId, LocalDate startDate, LocalDate endDate);
}
