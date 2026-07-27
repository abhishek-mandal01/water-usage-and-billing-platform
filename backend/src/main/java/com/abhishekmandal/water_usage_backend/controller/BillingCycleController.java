package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.entity.BillingCycle;
import com.abhishekmandal.water_usage_backend.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/billing-cycles")
public class BillingCycleController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/create")
    public ResponseEntity<?> createCycle(@RequestBody BillingCycleRequest req) {
        try {
            LocalDate start = LocalDate.parse(req.getStartDate());
            LocalDate end = LocalDate.parse(req.getEndDate());
            return ResponseEntity.ok(billingService.createBillingCycle(req.getAdminId(), start, end));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/finalize/{cycleId}")
    public ResponseEntity<?> finalizeCycle(@PathVariable Long cycleId) {
        try {
            return ResponseEntity.ok(billingService.finalizeBillingCycle(cycleId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/community/{adminId}")
    public ResponseEntity<?> getCycles(@PathVariable Long adminId) {
        return ResponseEntity.ok(billingService.getBillingCycles(adminId));
    }
}

class BillingCycleRequest {
    private Long adminId;
    private String startDate;
    private String endDate;

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
