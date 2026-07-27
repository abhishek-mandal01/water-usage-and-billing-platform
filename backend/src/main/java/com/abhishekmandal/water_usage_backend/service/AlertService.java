package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.Notification;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.NotificationRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private WaterUsageLogRepository logRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    // Runs daily at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkUsageAndGenerateAlerts() {
        System.out.println("Running scheduled alert checks...");
        List<Household> households = householdRepository.findAll();

        for (Household hh : households) {
            if (hh.getResident() == null || hh.getApartment() == null) continue;

            List<WaterUsageLog> logs = logRepository.findByHouseholdId(hh.getId());
            if (logs.isEmpty()) continue;

            // Sort descending by date just in case
            logs.sort((a, b) -> b.getReadingDate().compareTo(a.getReadingDate()));
            WaterUsageLog latestLog = logs.get(0);
            double latestConsumption = latestLog.getConsumption() != null ? latestLog.getConsumption() : 0.0;

            Double threshold = hh.getApartment().getUsageAlertThreshold();
            if (threshold == null) threshold = 20000.0;

            // 1. Threshold Check
            if (latestConsumption > threshold) {
                String msg = "Your household has exceeded the usage threshold of " + threshold + " L. Latest consumption: " + latestConsumption + " L.";
                createNotificationAndSendEmail(hh.getResident().getId(), hh.getResident().getEmail(), "High Water Usage Alert", msg, "ALERT");
            }

            // 2. Statistical Outlier / Leak Check (Minimum 3 samples)
            if (logs.size() >= 3) {
                // Calculate Mean
                double sum = 0;
                for (WaterUsageLog log : logs) {
                    sum += log.getConsumption() != null ? log.getConsumption() : 0.0;
                }
                double mean = sum / logs.size();

                // Calculate Standard Deviation
                double varianceSum = 0;
                for (WaterUsageLog log : logs) {
                    double val = log.getConsumption() != null ? log.getConsumption() : 0.0;
                    varianceSum += Math.pow(val - mean, 2);
                }
                double stdDev = Math.sqrt(varianceSum / logs.size());

                // If standard deviation is 0 (all previous readings were exactly identical), we can just skip or add a tiny delta
                if (stdDev > 0) {
                    // Check if latest reading > Mean + 2*StdDev
                    if (latestConsumption > (mean + 2 * stdDev)) {
                        String msg = "Potential Leak Warning! Your recent water consumption (" + latestConsumption + " L) is significantly higher than your household average (" + String.format("%.2f", mean) + " L). Please check for leaks.";
                        createNotificationAndSendEmail(hh.getResident().getId(), hh.getResident().getEmail(), "Leak Warning!", msg, "LEAK_WARNING");
                    }
                }
            }
        }
    }

    private void createNotificationAndSendEmail(Long recipientId, String email, String subject, String message, String type) {
        // Create DB Notification
        Notification notification = new Notification();
        // Use JPA reference instead of creating a detached entity
        com.abhishekmandal.water_usage_backend.entity.AppUser user = new com.abhishekmandal.water_usage_backend.entity.AppUser();
        user.setId(recipientId);
        notification.setRecipient(user);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);

        // Send Email asynchronously
        if (email != null && !email.isEmpty()) {
            emailService.sendEmail(email, subject, message);
        }
    }
}
