package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "residents")
@Data
@EqualsAndHashCode(callSuper = true)
public class Resident extends AppUser {
    private String householdNumber;
    private String phoneNumber;
    private String governmentId;
}
