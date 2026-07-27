package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tariff_plans")
@Data
public class TariffPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    private Double baseRate; // Cost per kL for first tier
    private Double baseLimit; // Limit for first tier in kL (e.g. 10kL)
    private Double excessRate; // Cost per kL beyond baseLimit
}
