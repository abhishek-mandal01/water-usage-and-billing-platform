package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "apartments")
@Data
public class Apartment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @OneToOne
    @JoinColumn(name = "community_admin_id", nullable = false)
    private CommunityAdmin communityAdmin; // Each CommunityAdmin manages one Apartment complex

    private Double baseRate = 5.0; // Rs/Liter for usage within tierLimit
    private Double tierLimit = 10000.0; // Limit in Liters
    private Double excessRate = 8.0; // Rs/Liter for usage above tierLimit
    private Double usageAlertThreshold = 20000.0; // Threshold in Liters for triggering alerts

    private Double lateFeePerMonth = 50.0; // Late fee amount (₹) charged per overdue month
    private Integer gracePeriodDays = 15; // Grace period in days before late fee applies
}
