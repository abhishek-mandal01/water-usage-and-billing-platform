package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ReportsDashboardDTO {
    private List<ReportRowDTO> reports;
    
    @Data
    public static class ReportRowDTO {
        private String community;
        private int totalHouseholds;
        private double waterUsage;
        private double totalBilled;
        private double paymentCollection;
        private String status;

        public ReportRowDTO(String community, int totalHouseholds, double waterUsage, double totalBilled, double paymentCollection, String status) {
            this.community = community;
            this.totalHouseholds = totalHouseholds;
            this.waterUsage = waterUsage;
            this.totalBilled = totalBilled;
            this.paymentCollection = paymentCollection;
            this.status = status;
        }
    }
}
