package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "households")
@Data
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String householdNumber; // e.g. D-204

    private Double areaSqFt;

    private Integer occupancy;

    @ManyToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @OneToOne
    @JoinColumn(name = "resident_id")
    private Resident resident; // A household may have a resident linked

    @OneToOne(mappedBy = "household", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("household")
    private WaterMeter waterMeter;
}
