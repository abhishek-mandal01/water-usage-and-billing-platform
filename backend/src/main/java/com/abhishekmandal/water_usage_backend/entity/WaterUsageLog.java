package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "water_usage_logs")
@Data
public class WaterUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne
    @JoinColumn(name = "meter_id") // Nullable in case manual entry without meter
    private WaterMeter meter;

    @Column(nullable = false)
    private LocalDate readingDate;

    @Column(nullable = false)
    private Double readingVolume; // Total cumulated volume on the meter (Liters or kL)

    private Double consumption; // Consumption derived from the previous reading (Liters or kL)

    private String status = "NORMAL"; // NORMAL, OVERUSE, ANOMALY
}
