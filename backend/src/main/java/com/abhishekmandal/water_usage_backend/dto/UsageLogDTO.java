package com.abhishekmandal.water_usage_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsageLogDTO {
    
    @NotBlank(message = "Household Number is required")
    private String householdNumber;

    @NotNull(message = "Reading volume is required")
    private Double readingVolume;
    
    @NotBlank(message = "Reading Date is required (YYYY-MM-DD)")
    private String readingDate;
}
