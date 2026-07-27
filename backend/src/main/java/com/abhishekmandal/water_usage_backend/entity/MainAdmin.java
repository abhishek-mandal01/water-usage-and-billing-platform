package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "main_admins")
@Data
@EqualsAndHashCode(callSuper = true)
public class MainAdmin extends AppUser {
    // Additional MainAdmin fields can go here if needed in the future
}
