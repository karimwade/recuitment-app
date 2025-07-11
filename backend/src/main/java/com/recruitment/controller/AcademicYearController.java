package com.recruitment.controller;

import com.recruitment.entity.AcademicYear;
import com.recruitment.repository.AcademicYearRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/academic-years")
@CrossOrigin(origins = "http://localhost:4200")
public class AcademicYearController {
    
    private final AcademicYearRepository academicYearRepository;

    public AcademicYearController(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    @GetMapping
    public ResponseEntity<List<AcademicYear>> getAllAcademicYears() {
        List<AcademicYear> years = academicYearRepository.findAll();
        return ResponseEntity.ok(years);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AcademicYear>> getActiveAcademicYears() {
        List<AcademicYear> years = academicYearRepository.findByActiveTrue();
        return ResponseEntity.ok(years);
    }

    @PostMapping
    public ResponseEntity<AcademicYear> createAcademicYear(@RequestBody CreateYearRequest request) {
        if (academicYearRepository.existsByYear(request.getYear())) {
            return ResponseEntity.badRequest().build();
        }
        
        AcademicYear year = new AcademicYear(request.getYear());
        year = academicYearRepository.save(year);
        return ResponseEntity.ok(year);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<AcademicYear> toggleAcademicYear(@PathVariable Long id) {
        AcademicYear year = academicYearRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Academic year not found"));
        
        year.setActive(!year.isActive());
        year = academicYearRepository.save(year);
        return ResponseEntity.ok(year);
    }

    public static class CreateYearRequest {
        private String year;

        public String getYear() { return year; }
        public void setYear(String year) { this.year = year; }
    }
}