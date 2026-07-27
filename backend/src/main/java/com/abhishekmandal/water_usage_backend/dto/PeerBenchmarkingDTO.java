package com.abhishekmandal.water_usage_backend.dto;

import lombok.Data;

@Data
public class PeerBenchmarkingDTO {
    private Double userConsumption;
    private Double apartmentAverage;
    private Double similarSizeAverage;
    private Double percentageDifference;
    private String percentileRank;
    private String conservationTip;

    public PeerBenchmarkingDTO() {}

    public PeerBenchmarkingDTO(Double userConsumption, Double apartmentAverage, Double similarSizeAverage, Double percentageDifference, String percentileRank, String conservationTip) {
        this.userConsumption = userConsumption;
        this.apartmentAverage = apartmentAverage;
        this.similarSizeAverage = similarSizeAverage;
        this.percentageDifference = percentageDifference;
        this.percentileRank = percentileRank;
        this.conservationTip = conservationTip;
    }
}
