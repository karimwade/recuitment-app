package com.recruitment.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ApplicationType type = ApplicationType.NEW;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.IN_PROGRESS;

    private String cvPath;
    private String degreePath;
    private String coverLetterPath;

    private String rejectionReason;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "announcement_id", nullable = false)
    @JsonBackReference
    private Announcement announcement;

    public enum ApplicationType {
        NEW, RENEWAL
    }

    public enum ApplicationStatus {
        IN_PROGRESS, ACCEPTED, REJECTED
    }

    // Constructors
    public Application() {}

    public Application(User user, Announcement announcement, ApplicationType type) {
        this.user = user;
        this.announcement = announcement;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ApplicationType getType() { return type; }
    public void setType(ApplicationType type) { this.type = type; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getCvPath() { return cvPath; }
    public void setCvPath(String cvPath) { this.cvPath = cvPath; }

    public String getDegreePath() { return degreePath; }
    public void setDegreePath(String degreePath) { this.degreePath = degreePath; }

    public String getCoverLetterPath() { return coverLetterPath; }
    public void setCoverLetterPath(String coverLetterPath) { this.coverLetterPath = coverLetterPath; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Announcement getAnnouncement() { return announcement; }
    public void setAnnouncement(Announcement announcement) { this.announcement = announcement; }
}