package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.ResidentReportDTO;
import com.abhishekmandal.water_usage_backend.entity.Apartment;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private HouseholdRepository householdRepository;

    @Mock
    private WaterUsageLogRepository waterUsageLogRepository;

    @InjectMocks
    private ReportService reportService;

    @Test
    void testComputeRankQuote_Rank1() {
        ReportService.RankQuoteResult res = reportService.computeRankQuote(1, 10);
        assertNotNull(res);
        assertEquals("Community #1 Saver", res.badge);
        assertEquals("LOW_USAGE", res.category);
        assertTrue(res.quote.contains("#1 in water conservation"));
    }

    @Test
    void testComputeRankQuote_HighRank() {
        ReportService.RankQuoteResult res = reportService.computeRankQuote(9, 10);
        assertNotNull(res);
        assertEquals("Highest Usage Tier", res.badge);
        assertEquals("HIGH_USAGE", res.category);
        assertTrue(res.quote.contains("High Usage Alert"));
    }

    @Test
    void testGetResidentReport_SuccessWithHouseholds() {
        Long userId = 1L;

        Apartment apt = new Apartment();
        apt.setId(100L);
        apt.setName("Sunny Heights");

        Household hh1 = new Household();
        hh1.setId(10L);
        hh1.setHouseholdNumber("101");
        hh1.setApartment(apt);

        Household hh2 = new Household();
        hh2.setId(20L);
        hh2.setHouseholdNumber("102");
        hh2.setApartment(apt);

        when(householdRepository.findByResidentId(userId)).thenReturn(Optional.of(hh1));
        when(householdRepository.findByApartmentId(100L)).thenReturn(Arrays.asList(hh1, hh2));

        WaterUsageLog log1 = new WaterUsageLog();
        log1.setConsumption(5000.0);
        WaterUsageLog log2 = new WaterUsageLog();
        log2.setConsumption(12000.0);

        when(waterUsageLogRepository.findByHouseholdId(10L)).thenReturn(Collections.singletonList(log1));
        when(waterUsageLogRepository.findByHouseholdId(20L)).thenReturn(Collections.singletonList(log2));

        ResidentReportDTO dto = reportService.getResidentReport(userId, "2026-08");

        assertNotNull(dto);
        assertEquals(1, dto.getRank()); // hh1 has lower usage (5000L < 12000L), so Rank 1
        assertEquals(2, dto.getTotalHouseholds());
        assertEquals("Sunny Heights", dto.getCommunityName());
        assertEquals("101", dto.getHouseholdNumber());
        assertNotNull(dto.getRankQuote());
    }
}
