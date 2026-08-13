package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private Double todaysUsage;
    private Double currentBillAmount;
    private String billingCycle;
    
    private List<ChartData> monthlyConsumption;
    private List<ChartData> weeklyUsage;
    private List<String> recentAlerts;
    private Double apartmentAverageComparison; // e.g. -12.0 for 12% below average
    private List<String> waterTipsFeed;
    private String waterFact;
}
