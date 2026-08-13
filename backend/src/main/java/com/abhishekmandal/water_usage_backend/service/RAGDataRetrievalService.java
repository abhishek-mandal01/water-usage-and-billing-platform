package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.*;
import com.abhishekmandal.water_usage_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * RAGDataRetrievalService — Role-Based Retrieval-Augmented Generation Context Fetcher.
 *
 * This service performs intent-matching on the user's message, then executes
 * the appropriate JPA queries scoped strictly by the user's authentication role.
 * Returns a formatted database context string to be injected into the AI system prompt.
 */
@Service
public class RAGDataRetrievalService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BulkWaterPurchaseRepository bulkWaterPurchaseRepository;

    // ── Intent Detection ──

    private enum Intent {
        USAGE, BILL, HOUSEHOLD, METER, TOP_USAGE, COUNT, RATE, GENERAL
    }

    private Intent detectIntent(String message) {
        String lower = message.toLowerCase();

        if (containsAny(lower, "highest", "maximum", "top", "most water", "biggest", "max usage", "peak")) {
            return Intent.TOP_USAGE;
        }
        if (containsAny(lower, "how many", "count", "total number", "total households", "total flats", "total residents")) {
            return Intent.COUNT;
        }
        if (containsAny(lower, "usage", "consumption", "water used", "how much water", "liters", "litres", "consumed")) {
            return Intent.USAGE;
        }
        if (containsAny(lower, "bill", "payment", "amount due", "pay", "invoice", "charge", "due", "unpaid", "paid")) {
            return Intent.BILL;
        }
        if (containsAny(lower, "household", "flat", "unit", "resident", "who lives", "occupant", "tenant")) {
            return Intent.HOUSEHOLD;
        }
        if (containsAny(lower, "meter", "reading", "serial", "sensor")) {
            return Intent.METER;
        }
        if (containsAny(lower, "rate", "tariff", "price per", "cost per", "per liter", "per litre", "charge per")) {
            return Intent.RATE;
        }

        return Intent.GENERAL;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }

    // ── Main Entry Point ──

    /**
     * Retrieves database context based on the user's message and role.
     *
     * @param userMessage The user's chat message
     * @param userId      The authenticated user's ID (null if guest)
     * @param role        The user's role (RESIDENT, COMMUNITY_ADMIN, MAIN_ADMIN, or null)
     * @return Formatted database context string, or empty string if no relevant data
     */
    public String retrieveContext(String userMessage, Long userId, String role) {
        if (role == null || userId == null) {
            return ""; // Unauthenticated — no database access
        }

        Intent intent = detectIntent(userMessage);

        if (intent == Intent.GENERAL) {
            return ""; // General/greeting — let the AI handle without DB context
        }

        switch (role) {
            case "RESIDENT":
                return retrieveResidentContext(intent, userId);
            case "COMMUNITY_ADMIN":
                return retrieveAdminContext(intent, userId);
            case "MAIN_ADMIN":
                return retrieveMainAdminContext(intent, userId);
            default:
                return "";
        }
    }

    // ── RESIDENT Context ──

    private String retrieveResidentContext(Intent intent, Long userId) {
        Optional<Household> householdOpt = householdRepository.findByResidentId(userId);
        if (householdOpt.isEmpty()) {
            return "No household assigned to this resident.";
        }

        Household hh = householdOpt.get();
        StringBuilder ctx = new StringBuilder();

        switch (intent) {
            case USAGE: {
                LocalDate now = LocalDate.now();
                LocalDate lastMonthStart = now.minusMonths(1).withDayOfMonth(1);
                LocalDate lastMonthEnd = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());
                Double lastMonthUsage = waterUsageLogRepository.sumConsumptionByHouseholdIdAndDateRange(hh.getId(), lastMonthStart, lastMonthEnd);
                Double currentMonthUsage = waterUsageLogRepository.sumConsumptionByHouseholdIdAndDateRange(hh.getId(), now.withDayOfMonth(1), now);

                ctx.append("Resident's Flat: ").append(hh.getHouseholdNumber()).append("\n");
                ctx.append("Last Month's Usage (").append(lastMonthStart.getMonth()).append("): ").append(lastMonthUsage != null ? lastMonthUsage : 0.0).append(" Liters\n");
                ctx.append("Current Month's Usage So Far: ").append(currentMonthUsage != null ? currentMonthUsage : 0.0).append(" Liters\n");
                break;
            }
            case BILL: {
                List<Bill> bills = billRepository.findByUserId(userId);
                if (bills.isEmpty()) {
                    ctx.append("No bills have been generated yet for this resident.\n");
                } else {
                    ctx.append("Resident's Flat: ").append(hh.getHouseholdNumber()).append("\n");
                    ctx.append("Total Bills: ").append(bills.size()).append("\n");
                    // Show latest 3 bills
                    bills.stream()
                            .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                            .limit(3)
                            .forEach(b -> ctx.append("  - Cycle '").append(b.getBillingCycle())
                                    .append("': ₹").append(String.format("%.2f", b.getAmount()))
                                    .append(" | Status: ").append(b.getStatus())
                                    .append(b.getDueDate() != null ? " | Due: " + b.getDueDate() : "")
                                    .append("\n"));
                    Double totalBilled = billRepository.sumAmountByUserId(userId);
                    ctx.append("Total Amount Billed: ₹").append(String.format("%.2f", totalBilled)).append("\n");
                }
                break;
            }
            case METER: {
                ctx.append("Flat: ").append(hh.getHouseholdNumber()).append("\n");
                if (hh.getWaterMeter() != null) {
                    ctx.append("Meter Serial: ").append(hh.getWaterMeter().getSerialNumber()).append("\n");
                    ctx.append("Installation Date: ").append(hh.getWaterMeter().getInstallationDate()).append("\n");
                }
                Optional<WaterUsageLog> latestLog = waterUsageLogRepository.findFirstByHouseholdIdOrderByReadingDateDesc(hh.getId());
                if (latestLog.isPresent()) {
                    ctx.append("Latest Reading: ").append(latestLog.get().getReadingVolume()).append(" L on ").append(latestLog.get().getReadingDate()).append("\n");
                }
                break;
            }
            case RATE: {
                Apartment apt = hh.getApartment();
                if (apt != null) {
                    ctx.append("Base Rate: ₹").append(apt.getBaseRate()).append("/Liter\n");
                    ctx.append("Tier Limit: ").append(apt.getTierLimit()).append(" Liters\n");
                    ctx.append("Excess Rate (above tier): ₹").append(apt.getExcessRate()).append("/Liter\n");
                    ctx.append("Late Fee Per Month: ₹").append(apt.getLateFeePerMonth()).append("\n");
                    ctx.append("Grace Period: ").append(apt.getGracePeriodDays()).append(" days\n");
                }
                break;
            }
            case HOUSEHOLD: {
                ctx.append("Your Flat: ").append(hh.getHouseholdNumber()).append("\n");
                ctx.append("Apartment: ").append(hh.getApartment() != null ? hh.getApartment().getName() : "N/A").append("\n");
                if (hh.getAreaSqFt() != null) ctx.append("Area: ").append(hh.getAreaSqFt()).append(" sq ft\n");
                if (hh.getOccupancy() != null) ctx.append("Occupancy: ").append(hh.getOccupancy()).append(" people\n");
                break;
            }
            default:
                // TOP_USAGE, COUNT not allowed for residents
                ctx.append("This information is not available for your role. You can view your own usage and bills.\n");
                break;
        }

        return ctx.toString();
    }

    // ── COMMUNITY_ADMIN Context ──

    private String retrieveAdminContext(Intent intent, Long adminId) {
        Optional<Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(adminId);
        if (aptOpt.isEmpty()) {
            return "No apartment assigned to this community admin.";
        }

        Apartment apt = aptOpt.get();
        StringBuilder ctx = new StringBuilder();
        ctx.append("Community: ").append(apt.getName()).append("\n");

        switch (intent) {
            case USAGE: {
                LocalDate now = LocalDate.now();
                LocalDate lastMonthStart = now.minusMonths(1).withDayOfMonth(1);
                LocalDate lastMonthEnd = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());
                Double lastMonthUsage = waterUsageLogRepository.sumConsumptionByApartmentIdAndDateRange(apt.getId(), lastMonthStart, lastMonthEnd);
                Double totalUsage = waterUsageLogRepository.sumConsumptionByAdminId(adminId);

                ctx.append("Last Month's Community Usage (").append(lastMonthStart.getMonth()).append("): ").append(lastMonthUsage != null ? lastMonthUsage : 0.0).append(" Liters\n");
                ctx.append("All-Time Total Community Usage: ").append(totalUsage != null ? totalUsage : 0.0).append(" Liters\n");
                break;
            }
            case BILL: {
                Double totalBilled = billRepository.sumAmountByAdminId(adminId);
                List<Household> households = householdRepository.findByApartmentCommunityAdminId(adminId);
                int paidCount = 0, unpaidCount = 0;
                double unpaidTotal = 0;

                for (Household hh : households) {
                    if (hh.getResident() != null) {
                        List<Bill> bills = billRepository.findByUserIdAndStatusOrderByBillingCycleDesc(hh.getResident().getId(), "UNPAID");
                        if (!bills.isEmpty()) {
                            unpaidCount++;
                            for (Bill b : bills) unpaidTotal += b.getAmount();
                        } else {
                            paidCount++;
                        }
                    }
                }

                ctx.append("Total Amount Billed: ₹").append(String.format("%.2f", totalBilled)).append("\n");
                ctx.append("Residents with Unpaid Bills: ").append(unpaidCount).append("\n");
                ctx.append("Total Unpaid Amount: ₹").append(String.format("%.2f", unpaidTotal)).append("\n");
                ctx.append("Residents Fully Paid: ").append(paidCount).append("\n");
                break;
            }
            case TOP_USAGE: {
                List<Object[]> topHouseholds = waterUsageLogRepository.findTopConsumingHouseholdsByApartmentId(apt.getId());
                if (topHouseholds.isEmpty()) {
                    ctx.append("No usage data recorded yet.\n");
                } else {
                    ctx.append("Top Consuming Households (All Time):\n");
                    int limit = Math.min(5, topHouseholds.size());
                    for (int i = 0; i < limit; i++) {
                        Object[] row = topHouseholds.get(i);
                        ctx.append("  ").append(i + 1).append(". Flat ").append(row[1])
                                .append(" — ").append(String.format("%.1f", ((Number) row[2]).doubleValue())).append(" Liters\n");
                    }
                }
                break;
            }
            case COUNT: {
                int total = householdRepository.findByApartmentCommunityAdminId(adminId).size();
                int occupied = householdRepository.countByApartmentIdAndResidentIsNotNull(apt.getId());
                ctx.append("Total Households (Flats): ").append(total).append("\n");
                ctx.append("Total Registered Residents (Occupied Households): ").append(occupied).append("\n");
                ctx.append("Vacant Households: ").append(total - occupied).append("\n");
                break;
            }
            case HOUSEHOLD: {
                List<Household> households = householdRepository.findByApartmentCommunityAdminId(adminId);
                ctx.append("Household Directory (").append(households.size()).append(" total):\n");
                for (Household hh : households) {
                    ctx.append("  - Flat ").append(hh.getHouseholdNumber()).append(": ");
                    if (hh.getResident() != null) {
                        ctx.append(hh.getResident().getName()).append(" (").append(hh.getResident().getEmail()).append(")");
                    } else {
                        ctx.append("Vacant");
                    }
                    ctx.append("\n");
                }
                break;
            }
            case METER: {
                List<Household> households = householdRepository.findByApartmentCommunityAdminId(adminId);
                ctx.append("Meter Readings:\n");
                for (Household hh : households) {
                    ctx.append("  - Flat ").append(hh.getHouseholdNumber());
                    if (hh.getWaterMeter() != null) {
                        ctx.append(" | Meter: ").append(hh.getWaterMeter().getSerialNumber());
                        Optional<WaterUsageLog> latestLog = waterUsageLogRepository.findFirstByHouseholdIdOrderByReadingDateDesc(hh.getId());
                        if (latestLog.isPresent()) {
                            ctx.append(" | Latest: ").append(latestLog.get().getReadingVolume()).append("L on ").append(latestLog.get().getReadingDate());
                        }
                    } else {
                        ctx.append(" | No meter installed");
                    }
                    ctx.append("\n");
                }
                break;
            }
            case RATE: {
                ctx.append("Base Rate: ₹").append(apt.getBaseRate()).append("/Liter\n");
                ctx.append("Tier Limit: ").append(apt.getTierLimit()).append(" Liters\n");
                ctx.append("Excess Rate: ₹").append(apt.getExcessRate()).append("/Liter\n");
                ctx.append("Late Fee Per Month: ₹").append(apt.getLateFeePerMonth()).append("\n");
                ctx.append("Grace Period: ").append(apt.getGracePeriodDays()).append(" days\n");
                ctx.append("Usage Alert Threshold: ").append(apt.getUsageAlertThreshold()).append(" Liters\n");
                break;
            }
            default:
                break;
        }

        return ctx.toString();
    }

    // ── MAIN_ADMIN (Super Admin) Context ──

    private String retrieveMainAdminContext(Intent intent, Long adminId) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("Platform-Wide Data (Super Admin View):\n");

        switch (intent) {
            case USAGE: {
                Double totalUsage = waterUsageLogRepository.sumAllConsumption();
                ctx.append("Total Platform Water Consumption: ").append(totalUsage != null ? totalUsage : 0.0).append(" Liters\n");

                // Per-apartment breakdown
                List<Apartment> apartments = apartmentRepository.findAll();
                if (!apartments.isEmpty()) {
                    ctx.append("Per-Community Breakdown:\n");
                    for (Apartment apt : apartments) {
                        Double aptUsage = waterUsageLogRepository.sumConsumptionByAdminId(apt.getCommunityAdmin().getId());
                        ctx.append("  - ").append(apt.getName()).append(": ").append(aptUsage != null ? aptUsage : 0.0).append(" Liters\n");
                    }
                }
                break;
            }
            case BILL: {
                Double totalBilled = billRepository.sumAllBilledAmount();
                ctx.append("Total Platform Revenue Billed: ₹").append(String.format("%.2f", totalBilled)).append("\n");

                List<Apartment> apartments = apartmentRepository.findAll();
                if (!apartments.isEmpty()) {
                    ctx.append("Per-Community Billing:\n");
                    for (Apartment apt : apartments) {
                        Double aptBilled = billRepository.sumAmountByAdminId(apt.getCommunityAdmin().getId());
                        ctx.append("  - ").append(apt.getName()).append(": ₹").append(String.format("%.2f", aptBilled)).append("\n");
                    }
                }
                break;
            }
            case TOP_USAGE: {
                List<Apartment> apartments = apartmentRepository.findAll();
                ctx.append("Top Consumers Per Community:\n");
                for (Apartment apt : apartments) {
                    List<Object[]> topHouseholds = waterUsageLogRepository.findTopConsumingHouseholdsByApartmentId(apt.getId());
                    if (!topHouseholds.isEmpty()) {
                        Object[] top = topHouseholds.get(0);
                        ctx.append("  - ").append(apt.getName()).append(": Flat ").append(top[1])
                                .append(" — ").append(String.format("%.1f", ((Number) top[2]).doubleValue())).append(" Liters\n");
                    }
                }
                break;
            }
            case COUNT: {
                List<Apartment> apartments = apartmentRepository.findAll();
                int totalHouseholds = 0, totalOccupied = 0;
                for (Apartment apt : apartments) {
                    int hhCount = householdRepository.findByApartmentId(apt.getId()).size();
                    int occCount = householdRepository.countByApartmentIdAndResidentIsNotNull(apt.getId());
                    totalHouseholds += hhCount;
                    totalOccupied += occCount;
                }
                ctx.append("Total Communities: ").append(apartments.size()).append("\n");
                ctx.append("Total Households (Flats): ").append(totalHouseholds).append("\n");
                ctx.append("Total Registered Residents (Occupied Households): ").append(totalOccupied).append("\n");
                ctx.append("Total Vacant: ").append(totalHouseholds - totalOccupied).append("\n");
                break;
            }
            case HOUSEHOLD: {
                List<Apartment> apartments = apartmentRepository.findAll();
                for (Apartment apt : apartments) {
                    List<Household> households = householdRepository.findByApartmentId(apt.getId());
                    ctx.append(apt.getName()).append(" (").append(households.size()).append(" flats):\n");
                    for (Household hh : households) {
                        ctx.append("  - Flat ").append(hh.getHouseholdNumber()).append(": ");
                        if (hh.getResident() != null) {
                            ctx.append(hh.getResident().getName());
                        } else {
                            ctx.append("Vacant");
                        }
                        ctx.append("\n");
                    }
                }
                break;
            }
            case RATE: {
                List<Apartment> apartments = apartmentRepository.findAll();
                ctx.append("Tariff Configuration Per Community:\n");
                for (Apartment apt : apartments) {
                    ctx.append("  ").append(apt.getName()).append(": Base ₹").append(apt.getBaseRate())
                            .append("/L, Excess ₹").append(apt.getExcessRate())
                            .append("/L beyond ").append(apt.getTierLimit()).append("L\n");
                }
                break;
            }
            case METER: {
                List<Apartment> apartments = apartmentRepository.findAll();
                int totalMeters = 0;
                for (Apartment apt : apartments) {
                    List<Household> households = householdRepository.findByApartmentId(apt.getId());
                    int metered = (int) households.stream().filter(h -> h.getWaterMeter() != null).count();
                    totalMeters += metered;
                    ctx.append("  ").append(apt.getName()).append(": ").append(metered).append("/").append(households.size()).append(" metered\n");
                }
                ctx.append("Total Metered Households: ").append(totalMeters).append("\n");
                break;
            }
            default:
                break;
        }

        return ctx.toString();
    }
}
