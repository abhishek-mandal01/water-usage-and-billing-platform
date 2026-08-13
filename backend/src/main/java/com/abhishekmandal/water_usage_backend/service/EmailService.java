package com.abhishekmandal.water_usage_backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:scamtern@gmail.com}")
    private String fromEmail;

    
    // Water drop logo icon for the HTML emails
    private final String LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3262/3262973.png"; 

    private String getHtmlTemplate(String title, String content) {
        return "<!DOCTYPE html>" +
               "<html><head><style>" +
               "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }" +
               ".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
               ".header { background-color: #2563eb; padding: 20px; text-align: center; color: #ffffff; }" +
               ".header img { width: 50px; height: 50px; margin-bottom: 10px; filter: brightness(0) invert(1); }" +
               ".header h1 { margin: 0; font-size: 24px; }" +
               ".content { padding: 30px; color: #374151; line-height: 1.6; font-size: 16px; }" +
               ".footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }" +
               ".btn { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }" +
               "</style></head><body>" +
               "<div class='container'>" +
               "<div class='header'>" +
               "<img src='" + LOGO_URL + "' alt='Smart Water Logo'/>" +
               "<h1>" + title + "</h1>" +
               "</div>" +
               "<div class='content'>" + content + "</div>" +
               "<div class='footer'>&copy; 2026 Smart Water Management System.<br>This is an automated email, please do not reply.</div>" +
               "</div></body></html>";
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name, String role) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            String roleName = "RESIDENT".equals(role) ? "Resident" : "Community Admin";
            
            helper.setFrom(fromEmail, "Smart Water Platform");
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Smart Water Platform!");
            
            String content = "<h2>Hello " + name + ",</h2>" +
                             "<p>Welcome to the Smart Water Management Platform! Your account has been successfully created as a <strong>" + roleName + "</strong>.</p>" +
                             "<p>You can now log in to your dashboard to monitor your water usage, manage billing, and receive intelligent insights.</p>" +
                             "<center><a href='http://localhost:5173/login' class='btn'>Log In to Your Dashboard</a></center>";
                             
            helper.setText(getHtmlTemplate("Welcome Aboard!", content), true);
            
            mailSender.send(message);
            System.out.println("Welcome email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + toEmail + ". Error: " + e.getMessage());
        }
    }

    @Async
    public void sendBillGeneratedEmail(String toEmail, String name, String cycleStr, Double amount, String dueDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, "Smart Water Platform");
            helper.setTo(toEmail);
            helper.setSubject("New Water Bill Generated - " + cycleStr);
            
            String content = "<h2>Hello " + name + ",</h2>" +
                             "<p>Your water bill for the cycle <strong>" + cycleStr + "</strong> has been finalized.</p>" +
                             "<table style='width:100%; border-collapse: collapse; margin: 20px 0;'>" +
                             "<tr><td style='padding: 10px; border-bottom: 1px solid #e5e7eb;'><strong>Total Amount Due:</strong></td><td style='padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #dc2626; font-size: 18px; font-weight: bold;'>₹" + amount + "</td></tr>" +
                             "<tr><td style='padding: 10px;'><strong>Due Date:</strong></td><td style='padding: 10px; text-align: right;'>" + dueDate + "</td></tr>" +
                             "</table>" +
                             "<p>Please log in to the Smart Water portal to view the detailed breakdown and pay your bill securely.</p>" +
                             "<center><a href='http://localhost:5173/login' class='btn'>View & Pay Bill</a></center>";
                             
            helper.setText(getHtmlTemplate("New Bill Generated", content), true);
            
            mailSender.send(message);
            System.out.println("Bill email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send bill email to " + toEmail + ". Error: " + e.getMessage());
        }
    }

    public void sendInviteEmail(String toEmail, String inviteLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, "Smart Water Platform");
            helper.setTo(toEmail);
            helper.setSubject("You have been invited to join the Smart Water Platform!");
            
            String content = "<h2>Hello,</h2>" +
                             "<p>Your Community Admin has invited you to register for the Smart Water Usage and Billing Platform.</p>" +
                             "<p>Please click the button below to set up your account and start monitoring your usage:</p>" +
                             "<center><a href='" + inviteLink + "' class='btn'>Set Up Account</a></center>";
                             
            helper.setText(getHtmlTemplate("Platform Invitation", content), true);
            
            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ". Error: " + e.getMessage());
            throw new RuntimeException("Email failed to send: " + e.getMessage());
        }
    }

    @Async
    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        
        try {
            mailSender.send(message);
            System.out.println("Alert email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send alert email to " + toEmail + ". Error: " + e.getMessage());
        }
    }

}
