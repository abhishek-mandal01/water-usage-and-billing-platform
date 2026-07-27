package com.abhishekmandal.water_usage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser recipient;

    @Column(nullable = false)
    private String title = "Notification";

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private String type; // e.g., 'ALERT', 'LEAK_WARNING', 'INFO'

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
