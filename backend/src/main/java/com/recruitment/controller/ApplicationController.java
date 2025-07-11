package com.recruitment.controller;

import com.recruitment.entity.Application;
import com.recruitment.service.ApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:4200")
public class ApplicationController {
    
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Application> submitApplication(
            Authentication auth,
            @RequestParam Long announcementId,
            @RequestParam String type,
            @RequestParam(required = false) MultipartFile cv,
            @RequestParam(required = false) MultipartFile degree,
            @RequestParam(required = false) MultipartFile coverLetter) {
        
        try {
            Application.ApplicationType appType = Application.ApplicationType.valueOf(type.toUpperCase());
            Application application = applicationService.submitApplication(
                auth.getName(), announcementId, appType, cv, degree, coverLetter);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(Authentication auth) {
        List<Application> applications = applicationService.getUserApplications(auth.getName());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Application>> searchApplications(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Application> applications = applicationService.searchApplications(
            name, email, year, PageRequest.of(page, size));
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        
        try {
            Application.ApplicationStatus appStatus = Application.ApplicationStatus.valueOf(status.toUpperCase());
            Application application = applicationService.updateApplicationStatus(id, appStatus, reason);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}