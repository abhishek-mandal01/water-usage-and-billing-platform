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
    private java.util.List<PendingBillDTO> pendingBills;
    private java.util.List<RecentAlertDTO> recentAlerts;
    private java.util.List<ChartDataDTO> consumptionTrend;
    private java.util.List<StatusDataDTO> statusBreakdown;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChartDataDTO {
        private String month;
        private double consumption;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StatusDataDTO {
        private String name;
        private int value;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PendingBillDTO {
        private String householdNumber;
        private String apartmentName;
        private Double amountDue;
        private Long billId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentAlertDTO {
        private String title;
        private String message;
        private String category;
    }
}
