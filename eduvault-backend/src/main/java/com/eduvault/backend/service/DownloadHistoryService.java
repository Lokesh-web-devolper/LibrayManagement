package com.eduvault.backend.service;

import com.eduvault.backend.dto.DownloadHistoryResponse;
import com.eduvault.backend.entity.DownloadHistory;
import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.entity.Student;
import com.eduvault.backend.repository.DownloadHistoryRepository;
import com.eduvault.backend.repository.ResourceRepository;
import com.eduvault.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DownloadHistoryService {

    private final DownloadHistoryRepository downloadHistoryRepository;
    private final StudentRepository studentRepository;
    private final ResourceRepository resourceRepository;

    public DownloadHistoryService(DownloadHistoryRepository downloadHistoryRepository,
                                  StudentRepository studentRepository,
                                  ResourceRepository resourceRepository) {
        this.downloadHistoryRepository = downloadHistoryRepository;
        this.studentRepository = studentRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<DownloadHistoryResponse> getDownloads(String studentId, String filter) {
        // Validate student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }

        List<DownloadHistory> history;
        LocalDateTime now = LocalDateTime.now();

        if ("today".equalsIgnoreCase(filter)) {
            LocalDateTime startOfDay = now.truncatedTo(ChronoUnit.DAYS);
            history = downloadHistoryRepository
                    .findByStudentIdAndDownloadedAtAfterOrderByDownloadedAtDesc(studentId, startOfDay);
        } else if ("week".equalsIgnoreCase(filter)) {
            LocalDateTime weekAgo = now.minusDays(7);
            history = downloadHistoryRepository
                    .findByStudentIdAndDownloadedAtAfterOrderByDownloadedAtDesc(studentId, weekAgo);
        } else if ("month".equalsIgnoreCase(filter)) {
            LocalDateTime monthAgo = now.minusDays(30);
            history = downloadHistoryRepository
                    .findByStudentIdAndDownloadedAtAfterOrderByDownloadedAtDesc(studentId, monthAgo);
        } else {
            history = downloadHistoryRepository.findByStudentIdOrderByDownloadedAtDesc(studentId);
        }

        return history.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DownloadHistoryResponse recordDownload(String studentId, String resourceId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId));
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found: " + resourceId));

        Optional<DownloadHistory> existing =
                downloadHistoryRepository.findByStudentIdAndResourceId(studentId, resourceId);

        DownloadHistory history;
        if (existing.isPresent()) {
            // Upsert: increment count and update timestamp
            history = existing.get();
            history.setDownloadCount(history.getDownloadCount() + 1);
            history.setDownloadedAt(LocalDateTime.now());
        } else {
            history = new DownloadHistory(student, resource, LocalDateTime.now(), 1);
        }

        return toResponse(downloadHistoryRepository.save(history));
    }

    public long getTotalDownloads(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }
        return downloadHistoryRepository.countByStudentId(studentId);
    }

    private DownloadHistoryResponse toResponse(DownloadHistory dh) {
        Resource r = dh.getResource();
        return new DownloadHistoryResponse(
                dh.getId(),
                r.getId(),
                r.getFileName(),
                r.getFileType(),
                r.getCategory(),
                r.getSubject(),
                r.getSemester(),
                dh.getDownloadedAt(),
                dh.getDownloadCount(),
                r.getFileUrl(),
                r.getTags(),
                r.getSize()
        );
    }
}
