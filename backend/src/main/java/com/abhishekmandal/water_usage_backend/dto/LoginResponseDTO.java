package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String verificationStatus; // Only populated for COMMUNITY_ADMIN
    private String gender;
    private String phoneNumber;
    private String householdNumber;

    public LoginResponseDTO(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
