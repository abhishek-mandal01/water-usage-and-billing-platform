package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;

@Data
public class TicketRequestDTO {
    private Long raisedById;
    private String title;
    private String description;
}
