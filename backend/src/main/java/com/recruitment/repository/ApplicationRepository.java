package com.recruitment.repository;

import com.recruitment.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    List<Application> findByAnnouncementId(Long announcementId);
    Optional<Application> findByUserIdAndAnnouncementId(Long userId, Long announcementId);
    
    @Query("SELECT a FROM Application a WHERE " +
           "(:name IS NULL OR LOWER(CONCAT(a.user.firstName, ' ', a.user.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:email IS NULL OR LOWER(a.user.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:year IS NULL OR a.announcement.academicYear.year = :year)")
    Page<Application> findApplicationsWithFilters(@Param("name") String name, 
                                                @Param("email") String email, 
                                                @Param("year") String year, 
                                                Pageable pageable);
}