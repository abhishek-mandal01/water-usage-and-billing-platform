package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO;
import com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO;
import com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO;
import com.abhishekmandal.water_usage_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/main-admin")
    public ResponseEntity<AnalyticsDashboardDTO> getMainAdminAnalytics() {
        return ResponseEntity.ok(dashboardService.getMainAdminAnalytics());
    }

    @GetMapping("/financials/main-admin")
    public ResponseEntity<FinancialsDashboardDTO> getMainAdminFinancials() {
        return ResponseEntity.ok(dashboardService.getMainAdminFinancials());
    }

    @GetMapping("/reports/main-admin")
    public ResponseEntity<ReportsDashboardDTO> getMainAdminReports() {
        return ResponseEntity.ok(dashboardService.getMainAdminReports());
    }

    @Autowired
    private com.abhishekmandal.water_usage_backend.service.PdfGenerationService pdfGenerationService;

    @GetMapping("/reports/main-admin/download")
    public ResponseEntity<byte[]> downloadReportsPdf() {
        try {
            byte[] pdfBytes = pdfGenerationService.generateReportsPdf(dashboardService.getMainAdminReports());
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=reports.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/financials/main-admin/download")
    public ResponseEntity<byte[]> downloadFinancialsPdf() {
        try {
            byte[] pdfBytes = pdfGenerationService.generateFinancialsPdf(dashboardService.getMainAdminFinancials());
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=financials.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
