package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long communityAdminId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String message;

    private String category; // e.g., "MAINTENANCE", "CONSERVATION", "GENERAL", "URGENT"

    private LocalDateTime createdAt = LocalDateTime.now();
}
