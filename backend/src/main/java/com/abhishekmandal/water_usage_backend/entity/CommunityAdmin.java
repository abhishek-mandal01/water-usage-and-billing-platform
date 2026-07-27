package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "community_admins")
@Data
@EqualsAndHashCode(callSuper = true)
public class CommunityAdmin extends AppUser {
    private String aadharCard;
    private String panCard;
    private String phoneNumber;
    private String address;
    private String verificationStatus = "UNSUBMITTED"; // UNSUBMITTED, PENDING, APPROVED, REJECTED
}
