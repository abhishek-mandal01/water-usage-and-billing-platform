package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.WaterMeterDTO;
import com.abhishekmandal.water_usage_backend.entity.*;
import com.abhishekmandal.water_usage_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConfigurationService {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private WaterMeterRepository waterMeterRepository;

    @Autowired
    private CommunityAdminRepository communityAdminRepository;

    // Manual creation methods removed per new architecture


    public WaterMeter addWaterMeter(WaterMeterDTO dto) {
        Optional<Household> householdOpt = householdRepository.findById(dto.getHouseholdId());
        if (householdOpt.isEmpty()) {
            throw new RuntimeException("Household not found");
        }

        WaterMeter meter = new WaterMeter();
        meter.setSerialNumber(dto.getSerialNumber());
        meter.setHousehold(householdOpt.get());
        
        return waterMeterRepository.save(meter);
    }

    public java.util.List<Apartment> getApartmentsByAdmin(Long adminId) {
        // Use proper repository query instead of findAll().stream().filter()
        return apartmentRepository.findByCommunityAdminId(adminId);
    }

    public java.util.List<Household> getHouseholds(Long adminId) {
        if (adminId == null) return householdRepository.findAll();
        return householdRepository.findByApartmentCommunityAdminId(adminId);
    }

    public java.util.List<WaterMeter> getMeters(Long adminId) {
        if (adminId == null) return waterMeterRepository.findAll();
        return waterMeterRepository.findByHouseholdApartmentCommunityAdminId(adminId);
    }

    public Apartment getApartmentConfig(Long adminId) {
        java.util.List<Apartment> apts = getApartmentsByAdmin(adminId);
        if (apts.isEmpty()) return null;
        return apts.get(0);
    }

    public Apartment updateApartmentConfig(Long adminId, Double baseRate, Double excessRate, Double tierLimit, Double usageAlertThreshold, Double lateFeePerMonth, Integer gracePeriodDays) {
        // Validate non-negative rates
        if (baseRate != null && baseRate < 0) throw new IllegalArgumentException("Base rate cannot be negative.");
        if (excessRate != null && excessRate < 0) throw new IllegalArgumentException("Excess rate cannot be negative.");
        if (tierLimit != null && tierLimit < 0) throw new IllegalArgumentException("Tier limit cannot be negative.");
        if (usageAlertThreshold != null && usageAlertThreshold < 0) throw new IllegalArgumentException("Usage alert threshold cannot be negative.");
        if (lateFeePerMonth != null && lateFeePerMonth < 0) throw new IllegalArgumentException("Late fee per month cannot be negative.");
        if (gracePeriodDays != null && gracePeriodDays < 0) throw new IllegalArgumentException("Grace period days cannot be negative.");

        java.util.List<Apartment> apts = getApartmentsByAdmin(adminId);
        if (!apts.isEmpty()) {
            Apartment apt = apts.get(0);
            if (baseRate != null) apt.setBaseRate(baseRate);
            if (excessRate != null) apt.setExcessRate(excessRate);
            if (tierLimit != null) apt.setTierLimit(tierLimit);
            if (usageAlertThreshold != null) apt.setUsageAlertThreshold(usageAlertThreshold);
            if (lateFeePerMonth != null) apt.setLateFeePerMonth(lateFeePerMonth);
            if (gracePeriodDays != null) apt.setGracePeriodDays(gracePeriodDays);
            return apartmentRepository.save(apt);
        }
        return null;
    }
}
