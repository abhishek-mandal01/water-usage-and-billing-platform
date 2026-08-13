package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class FinancialsDashboardDTO {
    private double totalRevenue;
    private double outstandingDues;
    private int processedTransactions;
    private double projectedNextMonth;
    private List<RevenueChartDataDTO> revenueTrend;
    private List<CommunityRevenueDTO> communityRevenue;
    
    @Data
    public static class RevenueChartDataDTO {
        private String month;
        private double collected;
        private double pending;
        
        public RevenueChartDataDTO(String month, double collected, double pending) {
            this.month = month;
            this.collected = collected;
            this.pending = pending;
        }
    }

    @Data
    public static class CommunityRevenueDTO {
        private String community;
        private double revenue;
        
        public CommunityRevenueDTO(String community, double revenue) {
            this.community = community;
            this.revenue = revenue;
        }
    }
}
