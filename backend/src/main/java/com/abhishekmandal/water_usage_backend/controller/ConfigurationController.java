package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.WaterMeterDTO;
import com.abhishekmandal.water_usage_backend.entity.Apartment;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.WaterMeter;
import com.abhishekmandal.water_usage_backend.repository.ApartmentRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterMeterRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import com.abhishekmandal.water_usage_backend.service.ConfigurationService;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class ConfigurationController {

    @Autowired
    private ConfigurationService configurationService;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private WaterMeterRepository waterMeterRepository;

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

    // Manual creation removed per new single-apartment architecture


    @PostMapping("/meters")
    public ResponseEntity<?> createMeter(@Valid @RequestBody WaterMeterDTO dto) {
        try {
            WaterMeter wm = configurationService.addWaterMeter(dto);
            return ResponseEntity.ok(wm);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/apartments")
    public ResponseEntity<?> getApartments(@RequestParam Long adminId) {
        return ResponseEntity.ok(configurationService.getApartmentsByAdmin(adminId));
    }

    @GetMapping("/apartments/all")
    public ResponseEntity<?> getAllApartments() {
        return ResponseEntity.ok(apartmentRepository.findAll());
    }

    @GetMapping("/households")
    public ResponseEntity<?> getHouseholds(@RequestParam(required = false) Long adminId) {
        return ResponseEntity.ok(configurationService.getHouseholds(adminId));
    }

    @Transactional
    @DeleteMapping("/households/{id}")
    public ResponseEntity<?> deleteHousehold(@PathVariable Long id) {
        if (householdRepository.existsById(id)) {
            // Delete associated WaterUsageLogs
            java.util.List<com.abhishekmandal.water_usage_backend.entity.WaterUsageLog> logs = waterUsageLogRepository.findByHouseholdId(id);
            waterUsageLogRepository.deleteAll(logs);

            // Delete associated WaterMeter
            java.util.Optional<com.abhishekmandal.water_usage_backend.entity.WaterMeter> meterOpt = waterMeterRepository.findByHouseholdId(id);
            meterOpt.ifPresent(meter -> waterMeterRepository.delete(meter));

            // Delete the Household
            householdRepository.deleteById(id);
            return ResponseEntity.ok("Household deleted successfully.");
        }
        return ResponseEntity.badRequest().body("Household not found.");
    }

    @GetMapping("/meters")
    public ResponseEntity<?> getMeters(@RequestParam(required = false) Long adminId) {
        return ResponseEntity.ok(configurationService.getMeters(adminId));
    }

    @GetMapping("/apartment-config")
    public ResponseEntity<?> getApartmentConfig(@RequestParam Long adminId) {
        Apartment apt = configurationService.getApartmentConfig(adminId);
        if (apt != null) return ResponseEntity.ok(apt);
        return ResponseEntity.badRequest().body("No apartment found for this admin");
    }

    @PostMapping("/apartment-config")
    public ResponseEntity<?> updateApartmentConfig(
            @RequestParam Long adminId,
            @RequestParam(required = false) Double baseRate,
            @RequestParam(required = false) Double excessRate,
            @RequestParam(required = false) Double tierLimit,
            @RequestParam(required = false) Double usageAlertThreshold,
            @RequestParam(required = false) Double lateFeePerMonth,
            @RequestParam(required = false) Integer gracePeriodDays
    ) {
        Apartment apt = configurationService.updateApartmentConfig(adminId, baseRate, excessRate, tierLimit, usageAlertThreshold, lateFeePerMonth, gracePeriodDays);
        if (apt != null) return ResponseEntity.ok(apt);
        return ResponseEntity.badRequest().body("Failed to update apartment config");
    }
}
