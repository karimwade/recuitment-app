package com.recruitment.service;

import com.recruitment.entity.Application;
import com.recruitment.entity.Announcement;
import com.recruitment.entity.User;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.AnnouncementRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {
    
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;
    private final EmailService emailService;
    private final String uploadDir = "/app/uploads";

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository,
                            AnnouncementRepository announcementRepository, EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
        this.emailService = emailService;
    }

    public Application submitApplication(String userEmail, Long announcementId, 
                                      Application.ApplicationType type,
                                      MultipartFile cv, MultipartFile degree, MultipartFile coverLetter) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Announcement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        if (!announcement.isActive()) {
            throw new RuntimeException("Announcement is not active");
        }
        
        Application existingApp = applicationRepository.findByUserIdAndAnnouncementId(user.getId(), announcementId)
            .orElse(null);
        
        if (existingApp != null) {
            throw new RuntimeException("Application already exists for this announcement");
        }
        
        Application application = new Application(user, announcement, type);
        
        try {
            if (cv != null) application.setCvPath(saveFile(cv, "cv"));
            if (degree != null) application.setDegreePath(saveFile(degree, "degree"));
            if (coverLetter != null) application.setCoverLetterPath(saveFile(coverLetter, "cover"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to save files");
        }
        
        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(Long applicationId, Application.ApplicationStatus status, String reason) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        application.setRejectionReason(reason);
        application.setUpdatedAt(LocalDateTime.now());
        
        application = applicationRepository.save(application);
        
        emailService.sendApplicationStatusEmail(
            application.getUser().getEmail(),
            application.getUser().getFirstName(),
            status.name(),
            reason
        );
        
        return application;
    }

    public List<Application> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId());
    }

    public Page<Application> searchApplications(String name, String email, String year, Pageable pageable) {
        return applicationRepository.findApplicationsWithFilters(name, email, year, pageable);
    }

    private String saveFile(MultipartFile file, String type) throws IOException {
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
            throw new RuntimeException("File size exceeds limit");
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = type + "_" + UUID.randomUUID() + extension;
        
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        
        return filename;
    }
}