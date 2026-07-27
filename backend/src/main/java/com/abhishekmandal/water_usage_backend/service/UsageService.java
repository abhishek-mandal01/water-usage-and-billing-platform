package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.UsageLogDTO;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.entity.Notification;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import com.abhishekmandal.water_usage_backend.repository.NotificationRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsageService {

    @Autowired
    private WaterUsageLogRepository logRepository;

    @Autowired
    private BillingService billingService;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public WaterUsageLog addManualLog(UsageLogDTO dto) {
        // Validate reading volume is not negative
        if (dto.getReadingVolume() == null || dto.getReadingVolume() < 0) {
            throw new IllegalArgumentException("Meter reading volume cannot be negative.");
        }

        Optional<Household> householdOpt = householdRepository.findByHouseholdNumber(dto.getHouseholdNumber());
        if (householdOpt.isEmpty()) {
            throw new RuntimeException("Household not found: " + dto.getHouseholdNumber());
        }
        Household hh = householdOpt.get();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(hh);
        log.setReadingVolume(dto.getReadingVolume());
        LocalDate readingDate = LocalDate.parse(dto.getReadingDate());
        log.setReadingDate(readingDate);
        
        if (logRepository.existsByHouseholdIdAndYearAndMonth(hh.getId(), readingDate.getYear(), readingDate.getMonthValue())) {
            throw new RuntimeException("A meter reading has already been recorded for this household in the selected month.");
        }
        
        Optional<WaterUsageLog> lastLogOpt = logRepository.findFirstByHouseholdIdOrderByReadingDateDesc(hh.getId());
        double consumption = dto.getReadingVolume();
        if (lastLogOpt.isPresent()) {
            double previousReading = lastLogOpt.get().getReadingVolume();
            consumption = dto.getReadingVolume() - previousReading;
            if (consumption < 0) {
                throw new IllegalArgumentException("New meter reading (" + dto.getReadingVolume() 
                    + ") cannot be less than previous reading (" + previousReading 
                    + "). Please verify the reading.");
            }
        }
        log.setConsumption(consumption); 
        WaterUsageLog savedLog = logRepository.save(log);

        if (hh.getResident() != null && consumption > 0) {
            String cycle = log.getReadingDate().getMonth().name() + " " + log.getReadingDate().getYear();
            billingService.generateBill(hh, consumption, cycle);
            checkAndTriggerAlert(hh, consumption);
        }
        
        return savedLog;
    }

    @Transactional
    public List<WaterUsageLog> processCsvUpload(MultipartFile file, Long adminId) throws Exception {
        List<WaterUsageLog> savedLogs = new ArrayList<>();
        
        CSVFormat format = CSVFormat.Builder.create()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreHeaderCase(true)
                .setTrim(true)
                .build();

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader, format)) {

            for (CSVRecord csvRecord : csvParser) {
                String householdNumber = csvRecord.get("HouseholdNumber");
                Double volume = Double.parseDouble(csvRecord.get("ReadingVolume"));
                String dateStr = csvRecord.get("Date"); // YYYY-MM-DD

                // Validate non-negative volume
                if (volume < 0) {
                    throw new IllegalArgumentException("Reading volume cannot be negative for household " + householdNumber + ".");
                }

                Optional<Household> householdOpt = householdRepository.findByHouseholdNumber(householdNumber);
                if (householdOpt.isEmpty()) {
                    throw new RuntimeException("Household not found in system: " + householdNumber);
                }
                
                Household household = householdOpt.get();
                
                if (household.getApartment().getCommunityAdmin() == null || !household.getApartment().getCommunityAdmin().getId().equals(adminId)) {
                    throw new RuntimeException("Unauthorized: Household " + householdNumber + " does not belong to your community.");
                }

                WaterUsageLog log = new WaterUsageLog();
                log.setHousehold(household);
                log.setReadingVolume(volume);
                LocalDate readingDate = LocalDate.parse(dateStr);
                log.setReadingDate(readingDate);
                
                if (logRepository.existsByHouseholdIdAndYearAndMonth(household.getId(), readingDate.getYear(), readingDate.getMonthValue())) {
                    throw new RuntimeException("A meter reading has already been recorded for household " + householdNumber + " in the month of " + readingDate.getMonth() + " " + readingDate.getYear() + ".");
                }
                
                Optional<WaterUsageLog> lastLogOpt = logRepository.findFirstByHouseholdIdOrderByReadingDateDesc(household.getId());
                double consumption = volume;
                if (lastLogOpt.isPresent()) {
                    double previousReading = lastLogOpt.get().getReadingVolume();
                    consumption = volume - previousReading;
                    if (consumption < 0) {
                        throw new IllegalArgumentException("New reading (" + volume 
                            + ") for household " + householdNumber 
                            + " is less than previous reading (" + previousReading + ").");
                    }
                }
                log.setConsumption(consumption);
                
                WaterUsageLog savedLog = logRepository.save(log);
                savedLogs.add(savedLog);
                
                if (household.getResident() != null && consumption > 0) {
                    String cycle = log.getReadingDate().getMonth().name() + " " + log.getReadingDate().getYear();
                    billingService.generateBill(household, consumption, cycle);
                    checkAndTriggerAlert(household, consumption);
                }
            }
        }
        return savedLogs;
    }

    public List<WaterUsageLog> getUsageLogsByResident(Long residentId) {
        return logRepository.findByHouseholdResidentIdOrderByReadingDateDesc(residentId);
    }

    private void checkAndTriggerAlert(Household hh, double consumption) {
        if (hh.getApartment() == null || hh.getApartment().getUsageAlertThreshold() == null) return;
        
        if (consumption > hh.getApartment().getUsageAlertThreshold()) {
            // Generate Dashboard Notification
            Notification notif = new Notification();
            notif.setRecipient(hh.getResident());
            notif.setTitle("High Water Usage Alert");
            notif.setMessage(String.format("Your water consumption for this billing cycle is %.2f L, which has exceeded the set threshold of %.2f L.", 
                consumption, hh.getApartment().getUsageAlertThreshold()));
            notif.setType("ALERT");
            notificationRepository.save(notif);
            
            // Send Email Notification
            if (hh.getResident().getEmail() != null) {
                String subject = "Water Usage Alert - Action Required";
                String body = String.format("Dear Resident,\n\nThis is an automated alert regarding your water usage.\n\nYour consumption (%.2f L) has exceeded the community alert threshold (%.2f L).\nPlease review your usage to avoid high excess charges and check for any potential leaks.\n\nRegards,\nCommunity Management",
                    consumption, hh.getApartment().getUsageAlertThreshold());
                emailService.sendEmail(hh.getResident().getEmail(), subject, body);
            }
        }
    }
}
