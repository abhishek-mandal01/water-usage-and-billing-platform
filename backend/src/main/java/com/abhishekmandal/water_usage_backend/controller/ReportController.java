package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.ResidentReportDTO;
import com.abhishekmandal.water_usage_backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/reports", "/api/admin/reports"})
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam Long adminId, 
            @RequestParam String format,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate
    ) {
        try {
            byte[] reportData;
            HttpHeaders headers = new HttpHeaders();

            if ("pdf".equalsIgnoreCase(format)) {
                reportData = reportService.generatePdfReport(adminId, startDate, endDate);
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "Water_Usage_Report.pdf");
            } else if ("xml".equalsIgnoreCase(format)) {
                reportData = reportService.generateXmlReport(adminId, startDate, endDate);
                headers.setContentType(MediaType.APPLICATION_XML);
                headers.setContentDispositionFormData("attachment", "Water_Usage_Report.xml");
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/resident/{userId}")
    public ResponseEntity<ResidentReportDTO> getResidentReport(
            @PathVariable Long userId,
            @RequestParam(required = false) String dateRange
    ) {
        ResidentReportDTO report = reportService.getResidentReport(userId, dateRange);
        return ResponseEntity.ok(report);
    }
}

