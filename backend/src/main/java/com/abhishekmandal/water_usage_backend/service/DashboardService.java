package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.ChartData;
import com.abhishekmandal.water_usage_backend.dto.DashboardSummaryDTO;
import com.abhishekmandal.water_usage_backend.entity.Bill;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.BillRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.AnnouncementRepository;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.Announcement;
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

    @Autowired
    private AnnouncementRepository announcementRepository;

    public DashboardSummaryDTO getDashboardSummary(Long userId) {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTodaysUsage(0.0);
        summary.setCurrentBillAmount(0.0);
        summary.setBillingCycle("N/A");

        // Get latest usage (real data if available)
        Optional<Household> householdOpt = householdRepository.findByResidentId(userId);
        if (householdOpt.isPresent()) {
            Optional<WaterUsageLog> latestLog = waterUsageLogRepository.findFirstByHouseholdIdOrderByReadingDateDesc(householdOpt.get().getId());
            if (latestLog.isPresent()) {
                summary.setTodaysUsage(latestLog.get().getConsumption());
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

        Double usageForTips = summary.getTodaysUsage() != null ? summary.getTodaysUsage() : 320.0;
        AiTipService.AiData aiData = aiTipService.getDailyAiData(userId, usageForTips, 385.0);
        summary.setWaterTipsFeed(aiData.tips);
        summary.setWaterFact(aiData.fact);

        return summary;
    }

    public com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO getAdminDashboardSummary(Long adminId) {
        com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO();
        
        dto.setTotalHouseholds(householdRepository.countByApartmentCommunityAdminId(adminId));
        dto.setTotalResidents(householdRepository.countByResidentIsNotNullAndApartmentCommunityAdminId(adminId));
        
        Double totalUsage = waterUsageLogRepository.sumConsumptionByAdminId(adminId);
        dto.setTotalUsage(totalUsage != null ? totalUsage : 0.0);
        
        dto.setCurrentCycle(LocalDate.now().getMonth().toString() + " " + LocalDate.now().getYear());
        
        java.util.List<com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.PendingBillDTO> pendingList = new java.util.ArrayList<>();
        List<Household> households = householdRepository.findByApartmentCommunityAdminId(adminId);
        
        int paidCount = 0;
        int unpaidCount = 0;

        for (Household hh : households) {
            if (hh.getResident() != null) {
                List<Bill> allBills = billRepository.findByUserId(hh.getResident().getId());
                for (Bill b : allBills) {
                    if ("PAID".equals(b.getStatus())) {
                        paidCount++;
                    } else if ("UNPAID".equals(b.getStatus())) {
                        unpaidCount++;
                        pendingList.add(new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.PendingBillDTO(
                            hh.getHouseholdNumber(),
                            hh.getApartment().getName(),
                            b.getAmount(),
                            b.getId()
                        ));
                    }
                }
            }
        }
        
        pendingList.sort((a, b) -> Long.compare(b.getBillId(), a.getBillId()));
        if (pendingList.size() > 3) {
            pendingList = pendingList.subList(0, 3);
        }
        dto.setPendingBills(pendingList);

        // Status Breakdown
        java.util.List<com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.StatusDataDTO> statusData = new java.util.ArrayList<>();
        statusData.add(new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.StatusDataDTO("Paid", paidCount));
        statusData.add(new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.StatusDataDTO("Pending", unpaidCount));
        dto.setStatusBreakdown(statusData);

        // 6 Month Trend
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<WaterUsageLog> recentLogs = waterUsageLogRepository.findByHouseholdApartmentCommunityAdminIdAndReadingDateGreaterThanEqual(adminId, sixMonthsAgo);
        
        java.util.Map<String, Double> monthlyTotals = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            String monthName = d.getMonth().toString().substring(0, 3);
            monthlyTotals.put(monthName, 0.0);
        }

        for (WaterUsageLog log : recentLogs) {
            String monthName = log.getReadingDate().getMonth().toString().substring(0, 3);
            if (monthlyTotals.containsKey(monthName)) {
                monthlyTotals.put(monthName, monthlyTotals.get(monthName) + log.getConsumption());
            }
        }

        java.util.List<com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.ChartDataDTO> trend = new java.util.ArrayList<>();
        for (java.util.Map.Entry<String, Double> entry : monthlyTotals.entrySet()) {
            trend.add(new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.ChartDataDTO(entry.getKey(), entry.getValue()));
        }
        dto.setConsumptionTrend(trend);
        
        // Fetch recent alerts
        List<Announcement> announcements = announcementRepository.findByCommunityAdminIdOrderByCreatedAtDesc(adminId);
        List<com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.RecentAlertDTO> alertsDto = new java.util.ArrayList<>();
        int count = 0;
        for (Announcement ann : announcements) {
            if (count >= 2) break;
            alertsDto.add(new com.abhishekmandal.water_usage_backend.dto.CommunityAdminDashboardDTO.RecentAlertDTO(
                ann.getTitle(),
                ann.getMessage(),
                ann.getCategory()
            ));
            count++;
        }
        dto.setRecentAlerts(alertsDto);
        
        return dto;
    }

    public com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO getMainAdminDashboardSummary() {
        com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO();
        
        dto.setTotalHouseholds(householdRepository.count());
        dto.setTotalUsers(householdRepository.countByResidentIsNotNull());
        
        Double totalUsage = waterUsageLogRepository.sumAllConsumption();
        dto.setTotalWaterUsedkL(totalUsage != null ? totalUsage : 0.0);
        
        Double totalRevenue = billRepository.sumTotalRevenue();
        dto.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        
        dto.setCurrentCycle(LocalDate.now().getMonth().toString() + " " + LocalDate.now().getYear());
        
        // 6 Month Usage Trend
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<WaterUsageLog> recentLogs = waterUsageLogRepository.findByReadingDateGreaterThanEqual(sixMonthsAgo);
        
        java.util.Map<String, Double> monthlyTotals = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            String monthName = d.getMonth().toString().substring(0, 3);
            monthlyTotals.put(monthName, 0.0);
        }

        for (WaterUsageLog log : recentLogs) {
            String monthName = log.getReadingDate().getMonth().toString().substring(0, 3);
            if (monthlyTotals.containsKey(monthName)) {
                monthlyTotals.put(monthName, monthlyTotals.get(monthName) + log.getConsumption());
            }
        }

        java.util.List<com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.ChartDataDTO> trend = new java.util.ArrayList<>();
        for (java.util.Map.Entry<String, Double> entry : monthlyTotals.entrySet()) {
            trend.add(new com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.ChartDataDTO(entry.getKey(), entry.getValue()));
        }
        dto.setConsumptionTrend(trend);

        // 6 Month Revenue Trend (mocking logic since Bill doesn't have a createdDate in my quick glance, but we can try to parse billingCycle or just mock it relative to totalRevenue to be safe)
        // Since we don't have a reliable date on Bill other than dueDate or paidDate which may be null, I will just distribute totalRevenue over the last 6 months for the demonstration of the chart being functional.
        // Or wait, does Bill have paidDate? Yes, "private LocalDate paidDate;"
        
        List<Bill> allBills = billRepository.findAll();
        java.util.Map<String, Double> revTotals = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            String monthName = d.getMonth().toString().substring(0, 3);
            revTotals.put(monthName, 0.0);
        }

        for (Bill b : allBills) {
            if ("PAID".equals(b.getStatus()) && b.getPaidDate() != null && !b.getPaidDate().isBefore(sixMonthsAgo)) {
                String monthName = b.getPaidDate().getMonth().toString().substring(0, 3);
                if (revTotals.containsKey(monthName)) {
                    revTotals.put(monthName, revTotals.get(monthName) + b.getAmount());
                }
            }
        }

        java.util.List<com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.ChartDataDTO> revTrend = new java.util.ArrayList<>();
        for (java.util.Map.Entry<String, Double> entry : revTotals.entrySet()) {
            revTrend.add(new com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.ChartDataDTO(entry.getKey(), entry.getValue()));
        }
        dto.setRevenueTrend(revTrend);

        // Fetch recent global announcements
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();
        List<com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.GlobalAlertDTO> alertsDto = new java.util.ArrayList<>();
        int count = 0;
        for (Announcement ann : announcements) {
            if (count >= 5) break; // Fetch up to 5 global alerts
            String commName = "System";
            if (ann.getCommunityAdminId() != null) {
                java.util.Optional<com.abhishekmandal.water_usage_backend.entity.Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(ann.getCommunityAdminId());
                if (aptOpt.isPresent()) {
                    commName = aptOpt.get().getName();
                }
            }
            alertsDto.add(new com.abhishekmandal.water_usage_backend.dto.MainAdminDashboardDTO.GlobalAlertDTO(
                ann.getTitle(),
                ann.getMessage(),
                ann.getCategory(),
                commName
            ));
            count++;
        }
        dto.setGlobalAlerts(alertsDto);

        return dto;
    }

    @Autowired
    private com.abhishekmandal.water_usage_backend.repository.ApartmentRepository apartmentRepository;

    public com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO getMainAdminAnalytics() {
        com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO();
        
        Double totalPlatformUsage = waterUsageLogRepository.sumAllConsumption();
        dto.setTotalPlatformUsage(totalPlatformUsage != null ? totalPlatformUsage : 0.0);
        
        List<com.abhishekmandal.water_usage_backend.entity.Apartment> apartments = apartmentRepository.findAll();
        dto.setActiveCommunities(apartments.size());
        
        long totalHouseholds = householdRepository.countByResidentIsNotNull();
        dto.setAvgHouseholdUsage(totalHouseholds > 0 ? dto.getTotalPlatformUsage() / totalHouseholds : 0.0);
        dto.setWaterConserved(112.0); // Mocked for now

        // Trend
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<WaterUsageLog> recentLogs = waterUsageLogRepository.findByReadingDateGreaterThanEqual(sixMonthsAgo);
        java.util.Map<String, Double> monthlyTotals = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            String monthName = d.getMonth().toString().substring(0, 3);
            monthlyTotals.put(monthName, 0.0);
        }

        for (WaterUsageLog log : recentLogs) {
            String monthName = log.getReadingDate().getMonth().toString().substring(0, 3);
            if (monthlyTotals.containsKey(monthName)) {
                monthlyTotals.put(monthName, monthlyTotals.get(monthName) + log.getConsumption());
            }
        }
        
        java.util.List<com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO.ChartDataDTO> trend = new java.util.ArrayList<>();
        for (java.util.Map.Entry<String, Double> entry : monthlyTotals.entrySet()) {
            trend.add(new com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO.ChartDataDTO(entry.getKey(), entry.getValue()));
        }
        dto.setConsumptionTrend(trend);

        // Community Breakdown
        java.util.List<com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO.CommunityUsageDTO> breakdown = new java.util.ArrayList<>();
        for (com.abhishekmandal.water_usage_backend.entity.Apartment apt : apartments) {
            Double usage = waterUsageLogRepository.sumConsumptionByApartmentIdAndDateRange(apt.getId(), LocalDate.of(2000, 1, 1), LocalDate.now().plusYears(100)); // Get all usage
            int hhCount = householdRepository.countByApartmentIdAndResidentIsNotNull(apt.getId());
            breakdown.add(new com.abhishekmandal.water_usage_backend.dto.AnalyticsDashboardDTO.CommunityUsageDTO(apt.getName(), usage != null ? usage : 0.0, hhCount));
        }
        dto.setCommunityBreakdown(breakdown);

        return dto;
    }

    public com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO getMainAdminFinancials() {
        com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO();
        
        Double totalRevenue = billRepository.sumTotalRevenue();
        dto.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        
        // Outstanding dues
        Double totalBilled = billRepository.sumAllBilledAmount();
        double outstanding = (totalBilled != null ? totalBilled : 0.0) - dto.getTotalRevenue();
        dto.setOutstandingDues(Math.max(0, outstanding));
        
        List<Bill> allBills = billRepository.findAll();
        dto.setProcessedTransactions((int) allBills.stream().filter(b -> "PAID".equals(b.getStatus())).count());
        dto.setProjectedNextMonth(dto.getTotalRevenue() * 1.05); // Simple 5% projection

        // Trend
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        java.util.Map<String, com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO.RevenueChartDataDTO> monthlyTotals = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            String monthName = d.getMonth().toString().substring(0, 3);
            monthlyTotals.put(monthName, new com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO.RevenueChartDataDTO(monthName, 0.0, 0.0));
        }

        for (Bill b : allBills) {
            // Using paidDate if paid, or just assign to current month if unpaid for mockup purposes, or try parsing billingCycle (e.g. "January 2026")
            String billMonthStr = null;
            if ("PAID".equals(b.getStatus()) && b.getPaidDate() != null) {
                if (!b.getPaidDate().isBefore(sixMonthsAgo)) {
                    billMonthStr = b.getPaidDate().getMonth().toString().substring(0, 3);
                }
            } else {
                if (b.getDueDate() != null && !b.getDueDate().isBefore(sixMonthsAgo)) {
                    billMonthStr = b.getDueDate().getMonth().toString().substring(0, 3);
                } else {
                    // Fallback to first 3 letters of billing cycle string "January 2026"
                    if (b.getBillingCycle() != null && b.getBillingCycle().length() >= 3) {
                        billMonthStr = b.getBillingCycle().substring(0, 3).toUpperCase();
                    }
                }
            }

            if (billMonthStr != null && monthlyTotals.containsKey(billMonthStr)) {
                com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO.RevenueChartDataDTO md = monthlyTotals.get(billMonthStr);
                if ("PAID".equals(b.getStatus())) {
                    md.setCollected(md.getCollected() + b.getAmount());
                } else {
                    md.setPending(md.getPending() + b.getAmount());
                }
            }
        }
        dto.setRevenueTrend(new java.util.ArrayList<>(monthlyTotals.values()));

        // Community Revenue
        java.util.List<com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO.CommunityRevenueDTO> commRev = new java.util.ArrayList<>();
        List<com.abhishekmandal.water_usage_backend.entity.Apartment> apartments = apartmentRepository.findAll();
        for (com.abhishekmandal.water_usage_backend.entity.Apartment apt : apartments) {
            if (apt.getCommunityAdmin() != null) {
                Double adminRev = 0.0;
                List<Household> households = householdRepository.findByApartmentId(apt.getId());
                for (Household hh : households) {
                    if (hh.getResident() != null) {
                        List<Bill> hb = billRepository.findByUserId(hh.getResident().getId());
                        adminRev += hb.stream().filter(b -> "PAID".equals(b.getStatus())).mapToDouble(Bill::getAmount).sum();
                    }
                }
                commRev.add(new com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO.CommunityRevenueDTO(apt.getName(), adminRev));
            }
        }
        dto.setCommunityRevenue(commRev);

        return dto;
    }

    public com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO getMainAdminReports() {
        com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO dto = new com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO();
        java.util.List<com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO.ReportRowDTO> rows = new java.util.ArrayList<>();
        
        List<com.abhishekmandal.water_usage_backend.entity.Apartment> apartments = apartmentRepository.findAll();
        for (com.abhishekmandal.water_usage_backend.entity.Apartment apt : apartments) {
            int hhCount = householdRepository.countByApartmentIdAndResidentIsNotNull(apt.getId());
            Double usage = waterUsageLogRepository.sumConsumptionByApartmentIdAndDateRange(apt.getId(), LocalDate.of(2000, 1, 1), LocalDate.now().plusYears(100));
            double totalUsage = usage != null ? usage : 0.0;
            
            double totalBilled = 0.0;
            double collected = 0.0;

            List<Household> households = householdRepository.findByApartmentId(apt.getId());
            for (Household hh : households) {
                if (hh.getResident() != null) {
                    List<Bill> hb = billRepository.findByUserId(hh.getResident().getId());
                    totalBilled += hb.stream().mapToDouble(Bill::getAmount).sum();
                    collected += hb.stream().filter(b -> "PAID".equals(b.getStatus())).mapToDouble(Bill::getAmount).sum();
                }
            }

            double collectionRate = totalBilled > 0 ? (collected / totalBilled) * 100.0 : 0.0;
            String status = collectionRate >= 90.0 ? "Excellent" : (collectionRate >= 70.0 ? "Good" : "Needs Attention");

            rows.add(new com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO.ReportRowDTO(
                apt.getName(),
                hhCount,
                totalUsage,
                totalBilled,
                collectionRate,
                status
            ));
        }
        dto.setReports(rows);
        return dto;
    }

    @Autowired
    private AiTipService aiTipService;

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
        
        // Generate dynamic tip using unified cached Gemini API
        AiTipService.AiData aiData = aiTipService.getDailyAiData(userId, Math.round(userConsumption * 10.0) / 10.0, Math.round(apartmentAvg * 10.0) / 10.0);
        String tip = aiData.peerTip;

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
