package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "bulk_water_purchases")
@Data
public class BulkWaterPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    @Column(nullable = false)
    private Double volumeLiters;

    @Column(nullable = false)
    private Double totalCost;

    private Double basePrice; // Rs/Liter

    private String receiptNumber;
    
    private String vendorName; // e.g., "Municipal Corporation", "Tanker Service"
}
