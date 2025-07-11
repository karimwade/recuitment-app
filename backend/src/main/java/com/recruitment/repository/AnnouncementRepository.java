package com.recruitment.repository;

import com.recruitment.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByActiveTrue();
    List<Announcement> findByAcademicYearId(Long academicYearId);
}