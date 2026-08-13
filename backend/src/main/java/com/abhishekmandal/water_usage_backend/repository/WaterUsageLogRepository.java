package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaterUsageLogRepository extends JpaRepository<WaterUsageLog, Long> {
    List<WaterUsageLog> findByHouseholdId(Long householdId);
    Optional<WaterUsageLog> findByHouseholdIdAndReadingDate(Long householdId, java.time.LocalDate readingDate);
    Optional<WaterUsageLog> findFirstByHouseholdIdOrderByReadingDateDesc(Long householdId);
    List<WaterUsageLog> findByHouseholdResidentIdOrderByReadingDateDesc(Long residentId);
    
    @org.springframework.data.jpa.repository.Query("SELECT SUM(w.consumption) FROM WaterUsageLog w WHERE w.household.apartment.communityAdmin.id = :adminId")
    Double sumConsumptionByAdminId(@org.springframework.data.repository.query.Param("adminId") Long adminId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(w) > 0 FROM WaterUsageLog w WHERE w.household.id = :householdId AND YEAR(w.readingDate) = :year AND MONTH(w.readingDate) = :month")
    boolean existsByHouseholdIdAndYearAndMonth(@org.springframework.data.repository.query.Param("householdId") Long householdId, @org.springframework.data.repository.query.Param("year") int year, @org.springframework.data.repository.query.Param("month") int month);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(w.consumption), 0) FROM WaterUsageLog w WHERE w.household.id = :householdId AND w.readingDate >= :startDate AND w.readingDate <= :endDate")
    Double sumConsumptionByHouseholdIdAndDateRange(@org.springframework.data.repository.query.Param("householdId") Long householdId, @org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);

    // RAG: Total consumption for a specific apartment in a date range
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(w.consumption), 0) FROM WaterUsageLog w WHERE w.household.apartment.id = :apartmentId AND w.readingDate >= :startDate AND w.readingDate <= :endDate")
    Double sumConsumptionByApartmentIdAndDateRange(@org.springframework.data.repository.query.Param("apartmentId") Long apartmentId, @org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);

    // RAG: Platform-wide total consumption
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(w.consumption), 0) FROM WaterUsageLog w")
    Double sumAllConsumption();

    // RAG: Top consuming households in an apartment (returns householdId, householdNumber, total consumption)
    @org.springframework.data.jpa.repository.Query("SELECT w.household.id, w.household.householdNumber, SUM(w.consumption) as total FROM WaterUsageLog w WHERE w.household.apartment.id = :apartmentId GROUP BY w.household.id, w.household.householdNumber ORDER BY total DESC")
    java.util.List<Object[]> findTopConsumingHouseholdsByApartmentId(@org.springframework.data.repository.query.Param("apartmentId") Long apartmentId);

    List<WaterUsageLog> findByHouseholdApartmentCommunityAdminIdAndReadingDateGreaterThanEqual(Long adminId, java.time.LocalDate date);

    List<WaterUsageLog> findByReadingDateGreaterThanEqual(java.time.LocalDate date);
}
