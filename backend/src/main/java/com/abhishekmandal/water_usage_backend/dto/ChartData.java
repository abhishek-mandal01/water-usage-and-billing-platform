package com.abhishekmandal.water_usage_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartData {
    private String label;
    private Double value;
}
