package com.abhishekmandal.water_usage_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileDTO {
    @NotBlank(message = "Name cannot be blank")
    private String name;
    
    // Email is usually read-only, but keeping it in DTO for response
    private String email;
    
    private String phoneNumber;
    private String role;
    private String gender;
    private LocalDate dateOfBirth;
    private String governmentId; // Only applicable for Resident, but exposed globally in DTO
    
    // Applicable for Community Admin
    private String aadharCard;
    private String panCard;
    private String address;
    private String verificationStatus;
}
