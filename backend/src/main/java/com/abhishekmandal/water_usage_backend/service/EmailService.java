package com.abhishekmandal.water_usage_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInviteEmail(String toEmail, String inviteLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("You have been invited to join the Water Usage Platform!");
        message.setText("Hello,\n\nYour Community Admin has invited you to register for the Water Usage and Billing Platform.\n\nPlease click the link below to set up your account:\n" 
                + inviteLink + "\n\nThank you,\nCommunity Management");
        
        // This will attempt to send the real email using properties from application.properties
        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ". Error: " + e.getMessage());
            throw new RuntimeException("Email failed to send. Please check your SMTP configuration in application.properties.");
        }
    }

    @Async
    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
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
