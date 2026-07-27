package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.Bill;
import com.abhishekmandal.water_usage_backend.repository.BillRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillingService billingService;

    public byte[] generateBillPdf(Long billId) throws IOException {
        Bill rawBill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        
        Bill bill = billingService.applyLateFeeIfNeeded(rawBill);

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                // Header Banner
                cs.setNonStrokingColor(37, 99, 235); // Blue #2563eb
                cs.addRect(0, 720, 612, 72);
                cs.fill();

                // Header Text
                cs.beginText();
                cs.setFont(fontBold, 22);
                cs.setNonStrokingColor(255, 255, 255);
                cs.newLineAtOffset(40, 750);
                cs.showText("SMART WATER PLATFORM");
                cs.endText();

                cs.beginText();
                cs.setFont(fontRegular, 12);
                cs.setNonStrokingColor(255, 255, 255);
                cs.newLineAtOffset(420, 750);
                cs.showText("INVOICE #" + bill.getId());
                cs.endText();

                // Invoice Title & Status
                cs.beginText();
                cs.setFont(fontBold, 16);
                cs.setNonStrokingColor(17, 24, 39);
                cs.newLineAtOffset(40, 670);
                cs.showText("Water Usage & Apportionment Bill");
                cs.endText();

                // Status Badge
                cs.beginText();
                cs.setFont(fontBold, 12);
                if ("PAID".equalsIgnoreCase(bill.getStatus())) {
                    cs.setNonStrokingColor(16, 185, 129); // Green
                } else {
                    cs.setNonStrokingColor(239, 68, 68); // Red
                }
                cs.newLineAtOffset(480, 670);
                cs.showText("STATUS: " + bill.getStatus());
                cs.endText();

                // Horizontal Line
                cs.setStrokingColor(229, 231, 235);
                cs.setLineWidth(1);
                cs.moveTo(40, 655);
                cs.lineTo(572, 655);
                cs.stroke();

                // Bill Details Section
                int y = 630;
                writeLabelValue(cs, fontBold, fontRegular, 40, y, "Resident Name:", bill.getUser() != null ? bill.getUser().getName() : "N/A");
                writeLabelValue(cs, fontBold, fontRegular, 320, y, "Billing Cycle:", bill.getBillingCycle());

                y -= 22;
                writeLabelValue(cs, fontBold, fontRegular, 40, y, "Resident Email:", bill.getUser() != null ? bill.getUser().getEmail() : "N/A");
                String dueDateStr = bill.getDueDate() != null ? bill.getDueDate().toString() : "N/A";
                writeLabelValue(cs, fontBold, fontRegular, 320, y, "Due Date:", dueDateStr);

                y -= 22;
                writeLabelValue(cs, fontBold, fontRegular, 40, y, "Razorpay Txn ID:", bill.getRazorpayPaymentId() != null ? bill.getRazorpayPaymentId() : "N/A");
                if (bill.getPaidDate() != null) {
                    writeLabelValue(cs, fontBold, fontRegular, 320, y, "Paid Date:", bill.getPaidDate().toString());
                }

                // Consumption Table Header
                y -= 40;
                cs.setNonStrokingColor(243, 244, 246);
                cs.addRect(40, y, 532, 25);
                cs.fill();

                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.setNonStrokingColor(55, 65, 81);
                cs.newLineAtOffset(50, y + 8);
                cs.showText("Item Description");
                cs.newLineAtOffset(280, 0);
                cs.showText("Usage / Rate");
                cs.newLineAtOffset(150, 0);
                cs.showText("Amount (INR)");
                cs.endText();

                // Table Items
                y -= 25;
                double totalLiters = bill.getTotalConsumptionLiters() != null ? bill.getTotalConsumptionLiters() : 0.0;
                double baseRate = bill.getBaseRate() != null ? bill.getBaseRate() : 5.0;
                double excessRate = bill.getExcessRate() != null ? bill.getExcessRate() : 8.0;
                double tierLimit = bill.getTierLimit() != null ? bill.getTierLimit() : 10000.0;

                double baseAmount = bill.getBaseAmount() != null ? bill.getBaseAmount() : Math.min(totalLiters, tierLimit) * baseRate;
                double excessAmount = bill.getExcessAmount() != null ? bill.getExcessAmount() : Math.max(0, totalLiters - tierLimit) * excessRate;

                // Base usage row
                writeTableRow(cs, fontRegular, 50, y, "Base Metered Consumption", String.format("%.1f L @ Rs %.2f/L", Math.min(totalLiters, tierLimit), baseRate), String.format("Rs %.2f", baseAmount));
                
                // Excess usage row
                y -= 22;
                if (totalLiters > tierLimit) {
                    writeTableRow(cs, fontRegular, 50, y, "Tier 2 Excess Usage", String.format("%.1f L @ Rs %.2f/L", totalLiters - tierLimit, excessRate), String.format("Rs %.2f", excessAmount));
                    y -= 22;
                }

                // Shared area facility allocation
                double sharedCharge = bill.getSharedFacilityCharge() != null ? bill.getSharedFacilityCharge() : 0.0;
                writeTableRow(cs, fontRegular, 50, y, "Shared Facility Apportionment", "Common Area Allocation", String.format("Rs %.2f", sharedCharge));
                
                // Late payment surcharge row
                y -= 22;
                double lateFee = bill.getLateFeeAmount() != null ? bill.getLateFeeAmount() : 0.0;
                int monthsOverdue = bill.getMonthsLate() != null ? bill.getMonthsLate() : 0;
                double lateRate = bill.getLateFeePerMonth() != null ? bill.getLateFeePerMonth() : 50.0;
                String lateRateDesc = monthsOverdue > 0 
                        ? String.format("%d Mo. Late @ Rs %.2f/mo", monthsOverdue, lateRate)
                        : "On Schedule (No Fee)";
                writeTableRow(cs, fontRegular, 50, y, "Late Payment Surcharge", lateRateDesc, String.format("Rs %.2f", lateFee));

                // Table Bottom Line
                y -= 15;
                cs.setStrokingColor(229, 231, 235);
                cs.moveTo(40, y);
                cs.lineTo(572, y);
                cs.stroke();

                // Total Amount Box
                y -= 45;
                cs.setNonStrokingColor(239, 246, 255);
                cs.addRect(320, y, 252, 35);
                cs.fill();

                cs.beginText();
                cs.setFont(fontBold, 14);
                cs.setNonStrokingColor(37, 99, 235);
                cs.newLineAtOffset(335, y + 10);
                cs.showText("TOTAL AMOUNT:");
                cs.newLineAtOffset(130, 0);
                cs.showText(String.format("Rs %.2f", bill.getAmount()));
                cs.endText();

                // Payment & Apportionment Breakdown Notes
                y -= 55;
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.setNonStrokingColor(17, 24, 39);
                cs.newLineAtOffset(40, y);
                cs.showText("Payment Instructions & Notes:");
                cs.endText();

                cs.beginText();
                cs.setFont(fontRegular, 9);
                cs.setNonStrokingColor(107, 114, 128);
                cs.newLineAtOffset(40, y - 16);
                cs.showText("1. Payments can be made online via Razorpay through your SmartWater Resident Portal.");
                cs.newLineAtOffset(0, -13);
                cs.showText("2. Personal usage charge is calculated using multi-tier tariff rates configured for your community.");
                cs.newLineAtOffset(0, -13);
                cs.showText("3. Shared facility charges apportion tanker procurement & common area water costs across households.");
                cs.newLineAtOffset(0, -13);
                cs.showText("4. Late payment surcharge applies for every month bill remains unpaid past the specified due date.");
                cs.endText();

                // Footer
                cs.beginText();
                cs.setFont(fontRegular, 9);
                cs.setNonStrokingColor(156, 163, 175);
                cs.newLineAtOffset(180, 40);
                cs.showText("Generated automatically by SmartWater Monitoring & Billing Platform © 2026");
                cs.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    private void writeLabelValue(PDPageContentStream cs, PDType1Font fontBold, PDType1Font fontRegular, int x, int y, String label, String value) throws IOException {
        cs.beginText();
        cs.setFont(fontBold, 10);
        cs.setNonStrokingColor(107, 114, 128);
        cs.newLineAtOffset(x, y);
        cs.showText(label);
        cs.setFont(fontRegular, 10);
        cs.setNonStrokingColor(17, 24, 39);
        cs.newLineAtOffset(90, 0);
        cs.showText(value);
        cs.endText();
    }

    private void writeTableRow(PDPageContentStream cs, PDType1Font font, int x, int y, String col1, String col2, String col3) throws IOException {
        cs.beginText();
        cs.setFont(font, 10);
        cs.setNonStrokingColor(55, 65, 81);
        cs.newLineAtOffset(x, y);
        cs.showText(col1);
        cs.newLineAtOffset(230, 0);
        cs.showText(col2);
        cs.newLineAtOffset(150, 0);
        cs.showText(col3);
        cs.endText();
    }
}
