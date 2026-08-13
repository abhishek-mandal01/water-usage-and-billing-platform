package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.*;
import com.abhishekmandal.water_usage_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillingService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

    @Autowired
    private BillingCycleRepository billingCycleRepository;

    @Autowired
    private BulkWaterPurchaseRepository bulkWaterPurchaseRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public BillingCycle createBillingCycle(Long adminId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date are required.");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        Apartment apt = apartmentRepository.findFirstByCommunityAdminId(adminId).orElse(null);
        if (apt == null) throw new RuntimeException("Apartment not found");

        List<BillingCycle> existingCycles = billingCycleRepository.findByApartmentIdOrderByIdDesc(apt.getId());
        for (BillingCycle existing : existingCycles) {
            // Date overlap logic: start1 <= end2 && end1 >= start2
            if (!startDate.isAfter(existing.getEndDate()) && !endDate.isBefore(existing.getStartDate())) {
                throw new RuntimeException("The selected dates overlap with an existing billing cycle (" + existing.getStartDate() + " to " + existing.getEndDate() + "). Billing cycles cannot overlap.");
            }
        }

        BillingCycle cycle = new BillingCycle();
        cycle.setApartment(apt);
        cycle.setStartDate(startDate);
        cycle.setEndDate(endDate);
        cycle.setStatus("OPEN");
        return billingCycleRepository.save(cycle);
    }

    public List<BillingCycle> getBillingCycles(Long adminId) {
        Apartment apt = apartmentRepository.findFirstByCommunityAdminId(adminId).orElse(null);
        if (apt == null) return List.of();
        return billingCycleRepository.findByApartmentIdOrderByIdDesc(apt.getId());
    }

    @Transactional
    public BillingCycle finalizeBillingCycle(Long cycleId) {
        Optional<BillingCycle> opt = billingCycleRepository.findById(cycleId);
        if (opt.isEmpty()) throw new RuntimeException("Cycle not found");
        BillingCycle cycle = opt.get();

        // Guard against double-finalization (race condition protection)
        if ("FINALIZED".equals(cycle.getStatus())) {
            throw new RuntimeException("Cycle already finalized");
        }

        Apartment apt = cycle.getApartment();
        List<Household> households = householdRepository.findByApartmentCommunityAdminId(apt.getCommunityAdmin().getId());
        List<BulkWaterPurchase> purchases = bulkWaterPurchaseRepository.findByApartmentIdAndPurchaseDateBetween(
            apt.getId(), cycle.getStartDate(), cycle.getEndDate()
        );

        double totalBulkCost = purchases.stream().mapToDouble(BulkWaterPurchase::getTotalCost).sum();
        
        // Split households into metered and unmetered
        List<Household> metered = households.stream().filter(h -> h.getWaterMeter() != null).collect(Collectors.toList());
        List<Household> unmetered = households.stream().filter(h -> h.getWaterMeter() == null).collect(Collectors.toList());

        double totalMeteredConsumption = 0.0;
        for (Household h : metered) {
            totalMeteredConsumption += getConsumptionForCycle(h.getId(), cycle.getStartDate(), cycle.getEndDate());
        }

        double totalUnmeteredArea = unmetered.stream().mapToDouble(h -> h.getAreaSqFt() != null ? h.getAreaSqFt() : 1000.0).sum();

        // Apportion logic: If both exist, 50% cost to metered pool, 50% to unmetered pool
        // If only one exists, 100% cost to that pool
        double meteredPoolCost = 0.0;
        double unmeteredPoolCost = 0.0;
        
        if (!metered.isEmpty() && !unmetered.isEmpty()) {
            meteredPoolCost = totalBulkCost / 2.0;
            unmeteredPoolCost = totalBulkCost / 2.0;
        } else if (!metered.isEmpty()) {
            meteredPoolCost = totalBulkCost;
        } else if (!unmetered.isEmpty()) {
            unmeteredPoolCost = totalBulkCost;
        }

        String cycleStr = cycle.getStartDate().format(DateTimeFormatter.ofPattern("MMM yyyy"));

        for (Household hh : households) {
            if (hh.getResident() != null) {
                double personalCharge = 0.0;
                double sharedCharge = 0.0;
                
                Double bRate = 0.0;
                Double eRate = 0.0;
                Double tLimit = 0.0;
                Double bAmount = 0.0;
                Double eAmount = 0.0;
                Double consump = 0.0;
                
                if (hh.getWaterMeter() != null) {
                    consump = getConsumptionForCycle(hh.getId(), cycle.getStartDate(), cycle.getEndDate());
                    
                    // Guard against negative consumption
                    if (consump < 0) consump = 0.0;
                    
                    bRate = hh.getApartment().getBaseRate() != null ? hh.getApartment().getBaseRate() : 5.0;
                    eRate = hh.getApartment().getExcessRate() != null ? hh.getApartment().getExcessRate() : 8.0;
                    tLimit = hh.getApartment().getTierLimit() != null ? hh.getApartment().getTierLimit() : 10000.0;

                    if (consump <= tLimit) {
                        bAmount = consump * bRate;
                        eAmount = 0.0;
                    } else {
                        bAmount = tLimit * bRate;
                        eAmount = (consump - tLimit) * eRate;
                    }
                    
                    personalCharge = bAmount + eAmount;
                    if (totalMeteredConsumption > 0) {
                        sharedCharge = (consump / totalMeteredConsumption) * meteredPoolCost;
                    }
                } else {
                    // Unmetered: no personal tiered charge, only shared based on area
                    double area = hh.getAreaSqFt() != null ? hh.getAreaSqFt() : 1000.0;
                    if (totalUnmeteredArea > 0) {
                        sharedCharge = (area / totalUnmeteredArea) * unmeteredPoolCost;
                    }
                }

                // Delete any existing UNPAID bill for this cycle to avoid duplicates
                Optional<Bill> existing = billRepository.findByUserIdAndBillingCycle(hh.getResident().getId(), cycleStr);
                if (existing.isPresent()) {
                    if ("PAID".equals(existing.get().getStatus())) continue; // don't override paid
                    billRepository.delete(existing.get());
                }

                if (personalCharge + sharedCharge <= 0) {
                    continue; // Do not generate Rs 0 bills
                }

                int graceDays = apt.getGracePeriodDays() != null ? apt.getGracePeriodDays() : 15;
                Double lateRate = apt.getLateFeePerMonth() != null ? apt.getLateFeePerMonth() : 50.0;
                LocalDate dueDate = cycle.getEndDate().plusDays(graceDays);

                Bill bill = new Bill();
                bill.setUser(hh.getResident());
                bill.setBillingCycle(cycleStr);
                bill.setPersonalUsageCharge(Math.max(0, personalCharge));
                bill.setSharedFacilityCharge(Math.max(0, sharedCharge));
                bill.setAmount(Math.max(0, personalCharge + sharedCharge));
                
                bill.setDueDate(dueDate);
                bill.setLateFeePerMonth(lateRate);
                bill.setLateFeeAmount(0.0);
                bill.setMonthsLate(0);
                
                if (hh.getWaterMeter() != null) {
                    bill.setTotalConsumptionLiters(consump);
                    bill.setBaseRate(bRate);
                    bill.setTierLimit(tLimit);
                    bill.setExcessRate(eRate);
                    bill.setBaseAmount(bAmount);
                    bill.setExcessAmount(eAmount);
                }
                
                bill.setStatus("UNPAID");
                bill = billRepository.save(bill);

                // Send Email Notification
                if (hh.getResident().getEmail() != null) {
                    emailService.sendBillGeneratedEmail(
                        hh.getResident().getEmail(), 
                        hh.getResident().getName(), 
                        cycleStr, 
                        bill.getAmount(), 
                        dueDate.toString()
                    );
                }
            }
        }

        cycle.setStatus("FINALIZED");
        return billingCycleRepository.save(cycle);
    }

    private double getConsumptionForCycle(Long householdId, LocalDate start, LocalDate end) {
        // Use database query instead of fetching all logs and filtering in-memory
        Double sum = waterUsageLogRepository.sumConsumptionByHouseholdIdAndDateRange(householdId, start, end);
        return sum != null ? sum : 0.0;
    }

    public Double calculateTieredAmount(Household hh, double consumption) {
        if (consumption < 0) consumption = 0.0; // Guard against negative values
        if (hh.getApartment() == null) return consumption * 5.0; // fallback
        
        Double baseRate = hh.getApartment().getBaseRate() != null ? hh.getApartment().getBaseRate() : 5.0;
        Double excessRate = hh.getApartment().getExcessRate() != null ? hh.getApartment().getExcessRate() : 8.0;
        Double tierLimit = hh.getApartment().getTierLimit() != null ? hh.getApartment().getTierLimit() : 10000.0;

        if (consumption <= tierLimit) {
            return consumption * baseRate;
        } else {
            return (tierLimit * baseRate) + ((consumption - tierLimit) * excessRate);
        }
    }

    @Transactional
    public Bill generateBill(Household hh, double consumption, String cycle) {
        if (consumption < 0) {
            throw new IllegalArgumentException("Consumption cannot be negative.");
        }

        Double bRate = hh.getApartment().getBaseRate() != null ? hh.getApartment().getBaseRate() : 5.0;
        Double eRate = hh.getApartment().getExcessRate() != null ? hh.getApartment().getExcessRate() : 8.0;
        Double tLimit = hh.getApartment().getTierLimit() != null ? hh.getApartment().getTierLimit() : 10000.0;

        int graceDays = hh.getApartment() != null && hh.getApartment().getGracePeriodDays() != null ? hh.getApartment().getGracePeriodDays() : 15;
        Double lateRate = hh.getApartment() != null && hh.getApartment().getLateFeePerMonth() != null ? hh.getApartment().getLateFeePerMonth() : 50.0;

        Double bAmount = 0.0;
        Double eAmount = 0.0;

        if (consumption <= tLimit) {
            bAmount = consumption * bRate;
        } else {
            bAmount = tLimit * bRate;
            eAmount = (consumption - tLimit) * eRate;
        }

        Double personalCharge = bAmount + eAmount;

        if (personalCharge <= 0) {
            return null; // Do not generate Rs 0 bills
        }

        Bill bill = new Bill();
        bill.setUser(hh.getResident());
        bill.setBillingCycle(cycle);
        bill.setPersonalUsageCharge(personalCharge);
        bill.setSharedFacilityCharge(0.0); // None added initially
        bill.setAmount(personalCharge);
        
        bill.setDueDate(LocalDate.now().plusDays(graceDays));
        bill.setLateFeePerMonth(lateRate);
        bill.setLateFeeAmount(0.0);
        bill.setMonthsLate(0);
        
        bill.setTotalConsumptionLiters(consumption);
        bill.setBaseRate(bRate);
        bill.setTierLimit(tLimit);
        bill.setExcessRate(eRate);
        bill.setBaseAmount(bAmount);
        bill.setExcessAmount(eAmount);
        
        bill.setStatus("UNPAID");
        return billRepository.save(bill);
    }

    @Transactional
    public Bill applyLateFeeIfNeeded(Bill bill) {
        if (bill == null) return null;
        
        if (bill.getDueDate() == null) {
            bill.setDueDate(LocalDate.now().plusDays(15));
        }

        double lateFeeRate = bill.getLateFeePerMonth() != null ? bill.getLateFeePerMonth() : 50.0;
        
        if ("PAID".equals(bill.getStatus())) {
            return bill;
        }

        LocalDate today = LocalDate.now();
        if (today.isAfter(bill.getDueDate())) {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(bill.getDueDate(), today);
            int months = (int) Math.ceil((double) daysLate / 30.0);
            if (months < 1) months = 1;
            
            bill.setMonthsLate(months);
            bill.setLateFeeAmount(months * lateFeeRate);
        } else {
            bill.setMonthsLate(0);
            bill.setLateFeeAmount(0.0);
        }

        double baseUsage = bill.getPersonalUsageCharge() != null ? bill.getPersonalUsageCharge() : 0.0;
        double shared = bill.getSharedFacilityCharge() != null ? bill.getSharedFacilityCharge() : 0.0;
        double lateFee = bill.getLateFeeAmount() != null ? bill.getLateFeeAmount() : 0.0;
        bill.setAmount(baseUsage + shared + lateFee);
        
        return billRepository.save(bill);
    }

    @Transactional
    public Bill payBill(Long billId) {
        Optional<Bill> opt = billRepository.findById(billId);
        if (opt.isEmpty()) {
            throw new RuntimeException("Bill not found");
        }
        Bill bill = applyLateFeeIfNeeded(opt.get());
        
        // Guard against double-payment
        if ("PAID".equals(bill.getStatus())) {
            throw new RuntimeException("Bill is already paid.");
        }
        
        bill.setPaidDate(LocalDate.now());
        bill.setStatus("PAID");
        return billRepository.save(bill);
    }

    @Transactional
    public List<Bill> getBillsByUser(Long userId) {
        List<Bill> bills = billRepository.findByUserId(userId);
        return bills.stream()
            .map(this::applyLateFeeIfNeeded)
            .filter(b -> b != null && b.getAmount() > 0)
            .collect(Collectors.toList());
    }

    @Transactional
    public List<Bill> getCommunityBills(Long adminId) {
        List<Household> households = householdRepository.findByApartmentCommunityAdminId(adminId);
        List<Long> residentIds = households.stream()
            .filter(h -> h.getResident() != null)
            .map(h -> h.getResident().getId())
            .collect(Collectors.toList());
            
        if (residentIds.isEmpty()) return List.of();
        
        List<Bill> bills = billRepository.findByUserIdInOrderByIdDesc(residentIds);
        return bills.stream()
            .map(this::applyLateFeeIfNeeded)
            .filter(b -> b != null && b.getAmount() > 0)
            .collect(Collectors.toList());
    }
    
    // Kept for backward compatibility with older controllers if they still call it
    public List<Bill> generateCommunityBills(Long adminId, Integer month, Integer year) {
        // We just redirect to getCommunityBills since generation is now via finalizeBillingCycle
        return getCommunityBills(adminId);
    }
}
