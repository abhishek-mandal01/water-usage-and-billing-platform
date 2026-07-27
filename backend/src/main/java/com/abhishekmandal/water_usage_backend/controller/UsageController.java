package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.UsageLogDTO;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.service.UsageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/usage")
public class UsageController {

    @Autowired
    private UsageService usageService;

    @PostMapping
    public ResponseEntity<?> addManualLog(@Valid @RequestBody UsageLogDTO dto) {
        try {
            WaterUsageLog log = usageService.addManualLog(dto);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("adminId") Long adminId) {
        try {
            List<WaterUsageLog> logs = usageService.processCsvUpload(file, adminId);
            return ResponseEntity.ok("Successfully processed " + logs.size() + " records.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process CSV: " + e.getMessage());
        }
    }

    @GetMapping("/my/{residentId}")
    public ResponseEntity<?> getMyUsageLogs(@PathVariable Long residentId) {
        return ResponseEntity.ok(usageService.getUsageLogsByResident(residentId));
    }
}
