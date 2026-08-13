package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {
    Optional<Household> findByHouseholdNumber(String householdNumber);
    Optional<Household> findByResidentId(Long residentId);
    java.util.List<Household> findByApartmentCommunityAdminId(Long adminId);
    int countByApartmentCommunityAdminId(Long adminId);
    int countByResidentIsNotNullAndApartmentCommunityAdminId(Long adminId);
    Optional<Household> findByHouseholdNumberAndApartmentCommunityAdminId(String householdNumber, Long adminId);

    // RAG: Find households by apartment ID
    java.util.List<Household> findByApartmentId(Long apartmentId);

    // RAG: Count occupied flats in a specific apartment
    int countByApartmentIdAndResidentIsNotNull(Long apartmentId);

    long countByResidentIsNotNull();
}
