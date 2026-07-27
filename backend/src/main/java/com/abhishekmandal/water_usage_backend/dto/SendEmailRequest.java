package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;

@Data
public class SendEmailRequest {
    private String email;
    private String inviteLink;
}
