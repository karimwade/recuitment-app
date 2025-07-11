package com.recruitment.controller;

import com.recruitment.entity.Announcement;
import com.recruitment.entity.AcademicYear;
import com.recruitment.repository.AnnouncementRepository;
import com.recruitment.repository.AcademicYearRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:4200")
public class AnnouncementController {
    
    private final AnnouncementRepository announcementRepository;
    private final AcademicYearRepository academicYearRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository, 
                                AcademicYearRepository academicYearRepository) {
        this.announcementRepository = announcementRepository;
        this.academicYearRepository = academicYearRepository;
    }

    @GetMapping("/active")
    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
        List<Announcement> announcements = announcementRepository.findByActiveTrue();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return ResponseEntity.ok(announcements);
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody CreateAnnouncementRequest request) {
        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
            .orElseThrow(() -> new RuntimeException("Academic year not found"));
        
        if (!academicYear.isActive()) {
            return ResponseEntity.badRequest().build();
        }
        
        Announcement announcement = new Announcement(request.getTitle(), request.getDescription(), academicYear);
        announcement = announcementRepository.save(announcement);
        return ResponseEntity.ok(announcement);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Announcement> toggleAnnouncement(@PathVariable Long id) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        announcement.setActive(!announcement.isActive());
        announcement = announcementRepository.save(announcement);
        return ResponseEntity.ok(announcement);
    }

    public static class CreateAnnouncementRequest {
        private String title;
        private String description;
        private Long academicYearId;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getAcademicYearId() { return academicYearId; }
        public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }
    }
}