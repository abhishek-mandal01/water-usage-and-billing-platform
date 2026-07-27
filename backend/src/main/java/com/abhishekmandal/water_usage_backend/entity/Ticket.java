package com.abhishekmandal.water_usage_backend.entity;

import com.abhishekmandal.water_usage_backend.entity.enums.TicketLevel;
import com.abhishekmandal.water_usage_backend.entity.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketLevel ticketLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private AppUser raisedBy;

    // For Resident->Community tickets, this could be the community admin ID
    // For Community->Main tickets, this could be null or a specific Main Admin ID
    @Column(name = "assigned_to_id")
    private Long assignedToId;

    private Boolean forwardedToMainAdmin = false;

    private String forwardedReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
