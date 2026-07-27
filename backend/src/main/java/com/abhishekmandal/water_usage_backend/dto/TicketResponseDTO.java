package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String level;
    private String raisedByName;
    private String raisedByRole;
    private Boolean forwardedToMainAdmin;
    private String forwardedReason;
    private LocalDateTime createdAt;
}
