package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalyticsDashboardDTO {
    private double totalPlatformUsage;
    private int activeCommunities;
    private double avgHouseholdUsage;
    private double waterConserved; // Just a mocked stat for now if we can't calculate it
    private List<ChartDataDTO> consumptionTrend;
    private List<CommunityUsageDTO> communityBreakdown;

    @Data
    public static class ChartDataDTO {
        private String month;
        private double totalVolume;
        
        public ChartDataDTO(String month, double totalVolume) {
            this.month = month;
            this.totalVolume = totalVolume;
        }
    }

    @Data
    public static class CommunityUsageDTO {
        private String community;
        private double usage;
        private int households;
        
        public CommunityUsageDTO(String community, double usage, int households) {
            this.community = community;
            this.usage = usage;
            this.households = households;
        }
    }
}
