package com.eduvault.backend.repository;

import com.eduvault.backend.entity.DownloadHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DownloadHistoryRepository extends JpaRepository<DownloadHistory, Long> {

    List<DownloadHistory> findByStudentIdOrderByDownloadedAtDesc(String studentId);

    List<DownloadHistory> findByStudentIdAndDownloadedAtAfterOrderByDownloadedAtDesc(
            String studentId, LocalDateTime from);

    Optional<DownloadHistory> findByStudentIdAndResourceId(String studentId, String resourceId);

    long countByStudentId(String studentId);
}
