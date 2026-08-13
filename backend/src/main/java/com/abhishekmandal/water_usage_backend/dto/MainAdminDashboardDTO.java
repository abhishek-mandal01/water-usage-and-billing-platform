package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MainAdminDashboardDTO {
    private long totalHouseholds;
    private long totalUsers;
    private double totalWaterUsedkL;
    private double totalRevenue;
    private String currentCycle;
    private List<ChartDataDTO> consumptionTrend;
    private List<ChartDataDTO> revenueTrend;
    private List<GlobalAlertDTO> globalAlerts;
    
    @Data
    public static class ChartDataDTO {
        private String month;
        private double value;
        
        public ChartDataDTO(String month, double value) {
            this.month = month;
            this.value = value;
        }
    }

    @Data
    public static class GlobalAlertDTO {
        private String title;
        private String message;
        private String category;
        private String communityName;

        public GlobalAlertDTO(String title, String message, String category, String communityName) {
            this.title = title;
            this.message = message;
            this.category = category;
            this.communityName = communityName;
        }
    }
}
