package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.FinancialsDashboardDTO;
import com.abhishekmandal.water_usage_backend.dto.ReportsDashboardDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    private void addHeader(Document document, String title) throws Exception {
        Paragraph header = new Paragraph("AQUA SMART WATER MANAGEMENT")
                .setBold().setFontSize(20).setTextAlignment(TextAlignment.CENTER).setFontColor(ColorConstants.BLUE);
        document.add(header);
        
        Paragraph subHeader = new Paragraph(title)
                .setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER);
        document.add(subHeader);
        
        Paragraph date = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .setFontSize(10).setTextAlignment(TextAlignment.RIGHT);
        document.add(date);
        
        document.add(new Paragraph("\n"));
    }

    public byte[] generateReportsPdf(ReportsDashboardDTO data) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        addHeader(document, "Community Reports Summary");

        Table table = new Table(new float[]{3, 2, 2, 2, 2, 2});
        table.setWidth(UnitValue.createPercentValue(100));

        String[] headers = {"Community", "Households", "Usage (L)", "Billed (INR)", "Collection %", "Status"};
        for (String h : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(h).setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
        }

        for (ReportsDashboardDTO.ReportRowDTO row : data.getReports()) {
            table.addCell(row.getCommunity());
            table.addCell(String.valueOf(row.getTotalHouseholds()));
            table.addCell(String.format("%.2f", row.getWaterUsage()));
            table.addCell(String.format("%.2f", row.getTotalBilled()));
            table.addCell(String.format("%.1f%%", row.getPaymentCollection()));
            table.addCell(row.getStatus());
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }
    
    public byte[] generateFinancialsPdf(FinancialsDashboardDTO data) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        addHeader(document, "Financials Overview");

        document.add(new Paragraph("Total Revenue: INR " + String.format("%.2f", data.getTotalRevenue())).setBold());
        document.add(new Paragraph("Outstanding Dues: INR " + String.format("%.2f", data.getOutstandingDues())).setBold());
        document.add(new Paragraph("Processed Transactions: " + data.getProcessedTransactions()).setBold());
        
        document.add(new Paragraph("\nCommunity Revenue Breakdown").setBold().setFontSize(14));

        Table table = new Table(new float[]{4, 2});
        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(new Cell().add(new Paragraph("Community").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
        table.addHeaderCell(new Cell().add(new Paragraph("Revenue (INR)").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));

        for (FinancialsDashboardDTO.CommunityRevenueDTO row : data.getCommunityRevenue()) {
            table.addCell(row.getCommunity());
            table.addCell(String.format("%.2f", row.getRevenue()));
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }
}
