package com.abhishekmandal.water_usage_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerificationDTO {
    
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "Aadhar Card is required")
    private String aadharCard;

    @NotBlank(message = "PAN Card is required")
    private String panCard;

    @NotBlank(message = "Phone Number is required")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    private String address;
}
