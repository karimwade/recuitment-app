package com.recruitment.repository;

import com.recruitment.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    List<AcademicYear> findByActiveTrue();
    boolean existsByYear(String year);
}