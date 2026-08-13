package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ResidentReportDTO {
    private Double monthlyUsage;
    private Double moneySpent;
    private Double previousMonthUsage;
    private Double previousMonthSpent;
    private List<ChartData> dailyUsageTrend;
    
    // Community Rank & Quote fields
    private Integer rank;
    private Integer totalHouseholds;
    private String communityName;
    private String householdNumber;
    private String rankQuote;
    private String rankBadge;
    private String tierCategory; // e.g. LOW_USAGE, AVERAGE_USAGE, HIGH_USAGE

    public ResidentReportDTO() {}

    public ResidentReportDTO(Double monthlyUsage, Double moneySpent, Double previousMonthUsage, Double previousMonthSpent,
                             List<ChartData> dailyUsageTrend, Integer rank, Integer totalHouseholds, String communityName,
                             String householdNumber, String rankQuote, String rankBadge, String tierCategory) {
        this.monthlyUsage = monthlyUsage;
        this.moneySpent = moneySpent;
        this.previousMonthUsage = previousMonthUsage;
        this.previousMonthSpent = previousMonthSpent;
        this.dailyUsageTrend = dailyUsageTrend;
        this.rank = rank;
        this.totalHouseholds = totalHouseholds;
        this.communityName = communityName;
        this.householdNumber = householdNumber;
        this.rankQuote = rankQuote;
        this.rankBadge = rankBadge;
        this.tierCategory = tierCategory;
    }
}
