package com.eduvault.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "download_history",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "resource_id"}))
public class DownloadHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(nullable = false)
    private LocalDateTime downloadedAt;

    @Column(nullable = false)
    private Integer downloadCount = 1;

    public DownloadHistory() {}

    public DownloadHistory(Student student, Resource resource, LocalDateTime downloadedAt, Integer downloadCount) {
        this.student = student;
        this.resource = resource;
        this.downloadedAt = downloadedAt;
        this.downloadCount = downloadCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }

    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }
}
