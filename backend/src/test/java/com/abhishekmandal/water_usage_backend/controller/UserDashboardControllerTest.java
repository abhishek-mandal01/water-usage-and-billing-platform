package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.DashboardSummaryDTO;
import com.abhishekmandal.water_usage_backend.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserDashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private UserDashboardController userDashboardController;

    @Test
    void testGetDashboardSummary() {
        DashboardSummaryDTO mockSummary = new DashboardSummaryDTO();
        mockSummary.setTodaysUsage(120.5);
        mockSummary.setCurrentBillAmount(550.0);
        mockSummary.setBillingCycle("June 2026");
        mockSummary.setApartmentAverageComparison(-5.0);

        when(dashboardService.getDashboardSummary(1L)).thenReturn(mockSummary);

        ResponseEntity<?> response = userDashboardController.getDashboardSummary(1L);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof DashboardSummaryDTO);
        DashboardSummaryDTO result = (DashboardSummaryDTO) response.getBody();
        assertEquals(120.5, result.getTodaysUsage());
        assertEquals(550.0, result.getCurrentBillAmount());
    }
}
