package com.abhishekmandal.water_usage_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InviteRegisterDTO {
    @NotBlank(message = "Token is required")
    private String token;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Household Number is required")
    private String householdNumber;
    
    @NotBlank(message = "Phone Number is required")
    private String phoneNumber;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Gender is required")
    private String gender;
    
    @NotNull(message = "Date of Birth is required")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "Government ID is required")
    private String governmentId;
}
