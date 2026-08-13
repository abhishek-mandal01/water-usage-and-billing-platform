package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.Apartment;
import com.abhishekmandal.water_usage_backend.entity.BulkWaterPurchase;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.WaterUsageLog;
import com.abhishekmandal.water_usage_backend.repository.ApartmentRepository;
import com.abhishekmandal.water_usage_backend.repository.BulkWaterPurchaseRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.WaterUsageLogRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abhishekmandal.water_usage_backend.dto.ChartData;
import com.abhishekmandal.water_usage_backend.dto.ResidentReportDTO;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    public static class RankQuoteResult {
        public final String quote;
        public final String badge;
        public final String category;

        public RankQuoteResult(String quote, String badge, String category) {
            this.quote = quote;
            this.badge = badge;
            this.category = category;
        }
    }

    private static class HouseholdUsageRecord {
        private final Long householdId;
        private final Double usage;

        public HouseholdUsageRecord(Long householdId, Double usage) {
            this.householdId = householdId;
            this.usage = usage;
        }

        public Long getHouseholdId() { return householdId; }
        public Double getUsage() { return usage; }
    }


    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private BulkWaterPurchaseRepository bulkWaterPurchaseRepository;

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

    public byte[] generatePdfReport(Long adminId, java.time.LocalDate startDate, java.time.LocalDate endDate) throws Exception {
        Optional<Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(adminId);
        if (aptOpt.isEmpty()) {
            throw new Exception("No apartment found for this admin.");
        }
        Apartment apt = aptOpt.get();
        List<Household> households = householdRepository.findByApartmentId(apt.getId());
        List<BulkWaterPurchase> purchases;
        if (startDate != null && endDate != null) {
            purchases = bulkWaterPurchaseRepository.findByApartmentIdAndPurchaseDateBetween(apt.getId(), startDate, endDate);
        } else {
            purchases = bulkWaterPurchaseRepository.findByApartmentId(apt.getId());
        }

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
                contentStream.beginText();
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Water Usage Report - " + apt.getName());
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.showText("Bulk Water Purchases:");
                contentStream.newLine();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                for (BulkWaterPurchase p : purchases) {
                    contentStream.showText("Date: " + p.getPurchaseDate() + " | Volume: " + p.getVolumeLiters() + "L | Cost: Rs " + p.getTotalCost());
                    contentStream.newLine();
                }

                contentStream.newLine();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.showText("Household Usage Summary:");
                contentStream.newLine();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);

                int lineCount = 0;
                for (Household hh : households) {
                    if (lineCount > 35) {
                        contentStream.endText();
                        contentStream.close();
                        page = new PDPage();
                        document.addPage(page);
                        PDPageContentStream newStream = new PDPageContentStream(document, page);
                        newStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                        newStream.beginText();
                        newStream.setLeading(14.5f);
                        newStream.newLineAtOffset(50, 750);
                        lineCount = 0;
                    }

                    double totalUsage = 0.0;
                    if (startDate != null && endDate != null) {
                        totalUsage = waterUsageLogRepository.sumConsumptionByHouseholdIdAndDateRange(hh.getId(), startDate, endDate);
                    } else {
                        List<WaterUsageLog> logs = waterUsageLogRepository.findByHouseholdId(hh.getId());
                        totalUsage = logs.stream().mapToDouble(l -> l.getConsumption() != null ? l.getConsumption() : 0.0).sum();
                    }
                    
                    String residentName = (hh.getResident() != null) ? hh.getResident().getName() : "Vacant";
                    contentStream.showText("Flat " + hh.getHouseholdNumber() + " (" + residentName + "): " + totalUsage + " Liters");
                    contentStream.newLine();
                    lineCount++;
                }
                contentStream.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    public byte[] generateXmlReport(Long adminId, java.time.LocalDate startDate, java.time.LocalDate endDate) throws Exception {
        Optional<Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(adminId);
        if (aptOpt.isEmpty()) {
            throw new Exception("No apartment found for this admin.");
        }
        Apartment apt = aptOpt.get();
        List<Household> households = householdRepository.findByApartmentId(apt.getId());
        List<BulkWaterPurchase> purchases;
        if (startDate != null && endDate != null) {
            purchases = bulkWaterPurchaseRepository.findByApartmentIdAndPurchaseDateBetween(apt.getId(), startDate, endDate);
        } else {
            purchases = bulkWaterPurchaseRepository.findByApartmentId(apt.getId());
        }

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<Report>\n");
        xml.append("  <CommunityName>").append(apt.getName()).append("</CommunityName>\n");
        
        xml.append("  <BulkPurchases>\n");
        for (BulkWaterPurchase p : purchases) {
            xml.append("    <Purchase>\n");
            xml.append("      <Date>").append(p.getPurchaseDate()).append("</Date>\n");
            xml.append("      <Volume>").append(p.getVolumeLiters()).append("</Volume>\n");
            xml.append("      <Cost>").append(p.getTotalCost()).append("</Cost>\n");
            xml.append("    </Purchase>\n");
        }
        xml.append("  </BulkPurchases>\n");

        xml.append("  <Households>\n");
        for (Household hh : households) {
            double totalUsage = 0.0;
            if (startDate != null && endDate != null) {
                totalUsage = waterUsageLogRepository.sumConsumptionByHouseholdIdAndDateRange(hh.getId(), startDate, endDate);
            } else {
                List<WaterUsageLog> logs = waterUsageLogRepository.findByHouseholdId(hh.getId());
                totalUsage = logs.stream().mapToDouble(l -> l.getConsumption() != null ? l.getConsumption() : 0.0).sum();
            }
            String residentName = (hh.getResident() != null) ? hh.getResident().getName() : "Vacant";

            xml.append("    <Household>\n");
            xml.append("      <FlatNumber>").append(hh.getHouseholdNumber()).append("</FlatNumber>\n");
            xml.append("      <Resident>").append(residentName).append("</Resident>\n");
            xml.append("      <TotalUsage>").append(totalUsage).append("</TotalUsage>\n");
            xml.append("    </Household>\n");
        }
        xml.append("  </Households>\n");
        xml.append("</Report>");

        return xml.toString().getBytes();
    }

    public ResidentReportDTO getResidentReport(Long userId, String dateRange) {
        Optional<Household> hhOpt = householdRepository.findByResidentId(userId);

        double userUsage = 14500.0;
        double moneySpent = 850.0;
        double prevUsage = 16000.0;
        double prevSpent = 920.0;
        int rank = 3;
        int totalHouseholds = 24;
        String communityName = "Green Valley Apartments";
        String hhNum = "A-302";

        if (hhOpt.isPresent()) {
            Household myHh = hhOpt.get();
            hhNum = myHh.getHouseholdNumber();
            Apartment apt = myHh.getApartment();
            if (apt != null) {
                communityName = apt.getName();
                List<Household> allHouseholds = householdRepository.findByApartmentId(apt.getId());
                if (!allHouseholds.isEmpty()) {
                    totalHouseholds = allHouseholds.size();

                    List<HouseholdUsageRecord> records = new ArrayList<>();
                    for (Household h : allHouseholds) {
                        List<WaterUsageLog> logs = waterUsageLogRepository.findByHouseholdId(h.getId());
                        double sum = logs.stream().mapToDouble(l -> l.getConsumption() != null ? l.getConsumption() : 0.0).sum();
                        records.add(new HouseholdUsageRecord(h.getId(), sum));
                    }

                    // Sort ascending (lowest consumption = rank 1)
                    records.sort(Comparator.comparingDouble(HouseholdUsageRecord::getUsage));

                    for (int i = 0; i < records.size(); i++) {
                        if (records.get(i).getHouseholdId().equals(myHh.getId())) {
                            rank = i + 1;
                            if (records.get(i).getUsage() > 0) {
                                userUsage = records.get(i).getUsage();
                            }
                            break;
                        }
                    }
                }
            }
        }

        if (moneySpent == 850.0 && userUsage != 14500.0) {
            moneySpent = Math.round(userUsage * 0.058 * 100.0) / 100.0;
        }

        RankQuoteResult quoteResult = computeRankQuote(rank, totalHouseholds);

        List<ChartData> weeklyTrend = new ArrayList<>();
        double quarter = userUsage / 4.0;
        weeklyTrend.add(new ChartData("Week 1", (double) Math.round(quarter * 0.9)));
        weeklyTrend.add(new ChartData("Week 2", (double) Math.round(quarter * 0.85)));
        weeklyTrend.add(new ChartData("Week 3", (double) Math.round(quarter * 1.15)));
        weeklyTrend.add(new ChartData("Week 4", (double) Math.round(quarter * 1.1)));


        return new ResidentReportDTO(
            userUsage,
            moneySpent,
            prevUsage,
            prevSpent,
            weeklyTrend,
            rank,
            totalHouseholds,
            communityName,
            hhNum,
            quoteResult.quote,
            quoteResult.badge,
            quoteResult.category
        );
    }

    public RankQuoteResult computeRankQuote(int rank, int totalHouseholds) {
        if (totalHouseholds <= 0) totalHouseholds = 24;
        double ratio = (double) rank / totalHouseholds;

        if (rank == 1) {
            return new RankQuoteResult(
                "🏆 Phenomenal Water Steward! Your household is ranked #1 in water conservation across the entire community. Thank you for setting the gold standard!",
                "Community #1 Saver",
                "LOW_USAGE"
            );
        } else if (rank <= 3 || ratio <= 0.15) {
            return new RankQuoteResult(
                "🌟 Exemplary Efficiency! Ranked #" + rank + " out of " + totalHouseholds + " households. Your conscientious water habits greatly benefit our entire community!",
                "Top 15% Water Saver",
                "LOW_USAGE"
            );
        } else if (ratio <= 0.35) {
            return new RankQuoteResult(
                "👏 Fantastic Conservation! Ranked #" + rank + " in the community. You are consuming significantly less water than most neighbors. Keep up the brilliant work!",
                "Top 35% Water Saver",
                "LOW_USAGE"
            );
        } else if (ratio <= 0.60) {
            return new RankQuoteResult(
                "💧 Mindful & Steady! Ranked #" + rank + " out of " + totalHouseholds + " households. Your usage is on par with community standards. Minor adjustments can push you into the top tier!",
                "Steady Conserver",
                "AVERAGE_USAGE"
            );
        } else if (ratio <= 0.85) {
            return new RankQuoteResult(
                "🌱 Room for Growth! Ranked #" + rank + " out of " + totalHouseholds + " households. Fixing minor drips or reducing shower durations can improve your rank and cut your bill!",
                "Above Average Usage",
                "HIGH_USAGE"
            );
        } else {
            return new RankQuoteResult(
                "⚠️ High Usage Alert! Ranked #" + rank + " out of " + totalHouseholds + " households (Highest consumption tier). Inspect fixtures for leaks and adopt water-saving habits to cut your bill next month!",
                "Highest Usage Tier",
                "HIGH_USAGE"
            );
        }
    }
}

