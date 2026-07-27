package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.entity.Apartment;
import com.abhishekmandal.water_usage_backend.entity.BulkWaterPurchase;
import com.abhishekmandal.water_usage_backend.repository.ApartmentRepository;
import com.abhishekmandal.water_usage_backend.repository.BulkWaterPurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bulk-purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class BulkPurchaseController {

    @Autowired
    private BulkWaterPurchaseRepository bulkPurchaseRepo;

    @Autowired
    private ApartmentRepository apartmentRepo;

    @PostMapping
    public ResponseEntity<?> addPurchase(@RequestBody BulkPurchaseRequest request) {
        Apartment apt = apartmentRepo.findFirstByCommunityAdminId(request.getAdminId()).orElse(null);
        if (apt == null) return ResponseEntity.badRequest().body("Apartment not found for admin.");

        BulkWaterPurchase purchase = new BulkWaterPurchase();
        purchase.setApartment(apt);
        purchase.setPurchaseDate(java.time.LocalDate.parse(request.getPurchaseDate()));
        purchase.setVolumeLiters(request.getVolumeLiters());
        purchase.setTotalCost(request.getTotalCost());
        purchase.setBasePrice(request.getBasePrice());
        purchase.setReceiptNumber(request.getReceiptNumber());
        purchase.setVendorName(request.getVendorName());

        return ResponseEntity.ok(bulkPurchaseRepo.save(purchase));
    }

    @GetMapping("/community/{adminId}")
    public ResponseEntity<?> getPurchases(@PathVariable Long adminId) {
        Apartment apt = apartmentRepo.findFirstByCommunityAdminId(adminId).orElse(null);
        if (apt == null) return ResponseEntity.badRequest().body("Apartment not found.");
        return ResponseEntity.ok(bulkPurchaseRepo.findByApartmentId(apt.getId()));
    }
}

class BulkPurchaseRequest {
    private Long adminId;
    private String purchaseDate;
    private Double volumeLiters;
    private Double totalCost;
    private Double basePrice;
    private String receiptNumber;
    private String vendorName;

    // Getters and Setters
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public String getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(String purchaseDate) { this.purchaseDate = purchaseDate; }
    public Double getVolumeLiters() { return volumeLiters; }
    public void setVolumeLiters(Double volumeLiters) { this.volumeLiters = volumeLiters; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
}
