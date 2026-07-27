package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommunityAdminDashboardDTO {
    private int totalHouseholds;
    private int totalResidents;
    private double totalUsage;
    private String currentCycle;
}
