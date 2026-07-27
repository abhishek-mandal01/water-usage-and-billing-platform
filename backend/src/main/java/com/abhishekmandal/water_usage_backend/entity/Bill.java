package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false)
    private String billingCycle;

    @Column(nullable = false)
    private Double amount;

    private Double personalUsageCharge = 0.0;
    
    private Double sharedFacilityCharge = 0.0;

    private Double totalConsumptionLiters;
    private Double baseRate;
    private Double tierLimit;
    private Double excessRate;
    private Double baseAmount;
    private Double excessAmount;

    private LocalDate dueDate;
    private Double lateFeeAmount = 0.0;
    private Double lateFeePerMonth = 50.0;
    private Integer monthsLate = 0;
    private LocalDate paidDate;

    @Column(nullable = false)
    private String status; // e.g., "UNPAID", "PAID"

    private String razorpayOrderId;
    private String razorpayPaymentId;
}
