package com.recruitment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "academic_years")
public class AcademicYear {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String year;

    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "academicYear", cascade = CascadeType.ALL)
    private List<Announcement> announcements;

    // Constructors
    public AcademicYear() {}

    public AcademicYear(String year) {
        this.year = year;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Announcement> getAnnouncements() { return announcements; }
    public void setAnnouncements(List<Announcement> announcements) { this.announcements = announcements; }
}