package com.abhishekmandal.water_usage_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WaterMeterDTO {
    @NotBlank(message = "Meter Serial Number is required")
    private String serialNumber;
    
    @NotNull(message = "Household ID is required")
    private Long householdId;
}
