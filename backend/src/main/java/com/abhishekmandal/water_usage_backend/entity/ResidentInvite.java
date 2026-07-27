package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "resident_invites")
public class ResidentInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Long communityAdminId; // The ID of the Community Admin who sent the invite

    @Column(nullable = false)
    private String status; // "PENDING", "USED"
}
