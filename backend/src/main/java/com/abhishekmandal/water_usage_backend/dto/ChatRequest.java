package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private Long userId; // Optional, to fetch community-specific rates
    private String language;
}
