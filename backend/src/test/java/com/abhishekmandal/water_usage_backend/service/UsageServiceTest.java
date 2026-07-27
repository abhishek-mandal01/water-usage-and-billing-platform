package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.UsageLogDTO;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsageServiceTest {

    @Mock
    private WaterUsageLogRepository logRepository;

    @Mock
    private HouseholdRepository householdRepository;

    @InjectMocks
    private UsageService usageService;

    @Test
    void testAddManualLog_Success() {
        UsageLogDTO dto = new UsageLogDTO();
        dto.setHouseholdNumber("D-204");
        dto.setReadingVolume(1500.0);
        dto.setReadingDate("2026-07-08");

        Household household = new Household();
        household.setId(1L);
        household.setHouseholdNumber("D-204");

        when(householdRepository.findByHouseholdNumber("D-204")).thenReturn(Optional.of(household));
        
        WaterUsageLog savedLog = new WaterUsageLog();
        savedLog.setId(10L);
        savedLog.setHousehold(household);
        savedLog.setReadingVolume(1500.0);
        savedLog.setConsumption(1500.0);
        
        when(logRepository.save(any(WaterUsageLog.class))).thenReturn(savedLog);

        WaterUsageLog result = usageService.addManualLog(dto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(1500.0, result.getConsumption());
        verify(householdRepository, times(1)).findByHouseholdNumber("D-204");
        verify(logRepository, times(1)).save(any(WaterUsageLog.class));
    }

    @Test
    void testAddManualLog_HouseholdNotFound() {
        UsageLogDTO dto = new UsageLogDTO();
        dto.setHouseholdNumber("D-999");
        dto.setReadingVolume(1500.0);
        dto.setReadingDate("2026-07-08");

        when(householdRepository.findByHouseholdNumber("D-999")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            usageService.addManualLog(dto);
        });

        assertEquals("Household not found: D-999", exception.getMessage());
        verify(logRepository, never()).save(any());
    }
}
