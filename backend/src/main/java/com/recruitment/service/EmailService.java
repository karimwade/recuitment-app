package com.recruitment.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String to, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Recruitment System");
        message.setText("Dear " + firstName + ",\n\nWelcome to our recruitment system! Your account has been created successfully.\n\nBest regards,\nRecruitment Team");
        
        mailSender.send(message);
    }

    public void sendApplicationStatusEmail(String to, String firstName, String status, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Application Status Update");
        
        String text = "Dear " + firstName + ",\n\nYour application status has been updated to: " + status;
        if (reason != null && !reason.isEmpty()) {
            text += "\nReason: " + reason;
        }
        text += "\n\nBest regards,\nRecruitment Team";
        
        message.setText(text);
        mailSender.send(message);
    }
}