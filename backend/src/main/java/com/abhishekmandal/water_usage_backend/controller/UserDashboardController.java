package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.DashboardSummaryDTO;
import com.abhishekmandal.water_usage_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class UserDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(@PathVariable Long userId) {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO> getAdminDashboardSummary(@PathVariable Long adminId) {
        return ResponseEntity.ok(dashboardService.getAdminDashboardSummary(adminId));
    }

    @GetMapping("/main-admin")
    public ResponseEntity<com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO> getMainAdminDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getMainAdminDashboardSummary());
    }

    @GetMapping("/peer-benchmarking/{userId}")
    public ResponseEntity<com.abhishekmandal.water_usage_backend.dto.PeerBenchmarkingDTO> getPeerBenchmarking(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getPeerBenchmarking(userId));
    }
}
