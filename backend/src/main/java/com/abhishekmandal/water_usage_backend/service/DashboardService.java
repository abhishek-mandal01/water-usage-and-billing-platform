package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.ChartData;
import com.abhishekmandal.water_usage_backend.dto.DashboardSummaryDTO;
import com.abhishekmandal.water_usage_backend.entity.Bill;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.BillRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.entity.Household;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private BillRepository billRepository;

    public DashboardSummaryDTO getDashboardSummary(Long userId) {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTodaysUsage(0.0);
        summary.setCurrentBillAmount(0.0);
        summary.setBillingCycle("N/A");

        // Get today's usage (real data if available)
        Optional<Household> householdOpt = householdRepository.findByResidentId(userId);
        if (householdOpt.isPresent()) {
            Optional<WaterUsageLog> todaysLog = waterUsageLogRepository.findByHouseholdIdAndReadingDate(householdOpt.get().getId(), LocalDate.now());
            if (todaysLog.isPresent()) {
                summary.setTodaysUsage(todaysLog.get().getConsumption());
            }
        }

        // Get current unpaid bill (real data if available)
        List<Bill> unpaidBills = billRepository.findByUserIdAndStatusOrderByBillingCycleDesc(userId, "UNPAID");
        if (!unpaidBills.isEmpty()) {
            Bill currentBill = unpaidBills.get(0);
            summary.setCurrentBillAmount(currentBill.getAmount());
            summary.setBillingCycle(currentBill.getBillingCycle());
        }

        // Mock data for Monthly Consumption Chart
        summary.setMonthlyConsumption(Arrays.asList(
            new ChartData("Jan", 12.5),
            new ChartData("Feb", 14.0),
            new ChartData("Mar", 11.2),
            new ChartData("Apr", 15.1),
            new ChartData("May", 13.8),
            new ChartData("Jun", 16.0)
        ));

        // Mock data for Weekly Usage Chart
        summary.setWeeklyUsage(Arrays.asList(
            new ChartData("Mon", 220.0),
            new ChartData("Tue", 245.0),
            new ChartData("Wed", 210.0),
            new ChartData("Thu", 260.0),
            new ChartData("Fri", 280.0),
            new ChartData("Sat", 310.0),
            new ChartData("Sun", 290.0)
        ));

        // Mock Recent Alerts
        summary.setRecentAlerts(Arrays.asList(
            "Water supply maintenance scheduled for Friday 10 AM.",
            "You used 15% less water this week compared to last week!"
        ));

        // Mock Apartment Average Comparison (e.g. -12.0 means 12% below average)
        summary.setApartmentAverageComparison(-12.0);

        summary.setApartmentAverageComparison(-12.0);

        return summary;
    }

    public com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO getAdminDashboardSummary(Long adminId) {
        com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO();
        
        dto.setTotalHouseholds(householdRepository.countByApartmentCommunityAdminId(adminId));
        dto.setTotalResidents(householdRepository.countByResidentIsNotNullAndApartmentCommunityAdminId(adminId));
        
        Double totalUsage = waterUsageLogRepository.sumConsumptionByAdminId(adminId);
        dto.setTotalUsage(totalUsage != null ? totalUsage : 0.0);
        
        dto.setCurrentCycle(LocalDate.now().getMonth().toString() + " " + LocalDate.now().getYear());
        
        return dto;
    }

    public com.abhishekmandal.water_usage_backend.dto.PeerBenchmarkingDTO getPeerBenchmarking(Long userId) {
        Double userConsumption = 320.0;
        Double apartmentAvg = 385.0;
        Double similarAvg = 360.0;

        Optional<Household> hhOpt = householdRepository.findByResidentId(userId);
        if (hhOpt.isPresent()) {
            List<WaterUsageLog> logs = waterUsageLogRepository.findByHouseholdId(hhOpt.get().getId());
            if (!logs.isEmpty()) {
                double total = logs.stream().mapToDouble(l -> l.getConsumption() != null ? l.getConsumption() : 0.0).sum();
                userConsumption = total / logs.size();
            }
        }

        double diff = ((userConsumption - apartmentAvg) / apartmentAvg) * 100.0;
        String rank = diff <= -15 ? "Top 10% Water Saver" : (diff <= 0 ? "Top 25% Water Saver" : "Average Conserver");
        String tip = diff <= 0 ? "Excellent job! You are using less water than 75% of your neighbors." : "Tip: Installing aerators on faucets can reduce your daily usage by up to 20%.";

        return new com.abhishekmandal.water_usage_backend.dto.PeerBenchmarkingDTO(
            Math.round(userConsumption * 10.0) / 10.0,
            Math.round(apartmentAvg * 10.0) / 10.0,
            Math.round(similarAvg * 10.0) / 10.0,
            Math.round(diff * 10.0) / 10.0,
            rank,
            tip
        );
    }
}
