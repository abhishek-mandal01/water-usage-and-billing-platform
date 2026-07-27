package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.service.BillingService;
import com.abhishekmandal.water_usage_backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private PdfService pdfService;

    @GetMapping("/my/{userId}")
    public ResponseEntity<?> getMyBills(@PathVariable Long userId) {
        return ResponseEntity.ok(billingService.getBillsByUser(userId));
    }

    @PostMapping("/pay/{billId}")
    public ResponseEntity<?> payBill(@PathVariable Long billId) {
        try {
            return ResponseEntity.ok(billingService.payBill(billId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateCommunityBills(@RequestBody GenerateBillRequest request) {
        try {
            return ResponseEntity.ok(billingService.generateCommunityBills(request.getAdminId(), request.getMonth(), request.getYear()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/community/{adminId}")
    public ResponseEntity<?> getCommunityBills(@PathVariable Long adminId) {
        return ResponseEntity.ok(billingService.getCommunityBills(adminId));
    }

    @GetMapping("/pdf/{billId}")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long billId) {
        try {
            byte[] pdfBytes = pdfService.generateBillPdf(billId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + billId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

class GenerateBillRequest {
    private Long adminId;
    private Integer month;
    private Integer year;

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    
    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
}
