package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "water_meters")
@Data
public class WaterMeter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    private LocalDate installationDate;

    @OneToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
}
