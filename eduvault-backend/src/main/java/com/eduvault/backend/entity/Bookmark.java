package com.eduvault.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "resource_id"}))
public class Bookmark {

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
    private LocalDateTime bookmarkedAt;

    public Bookmark() {}

    public Bookmark(Student student, Resource resource, LocalDateTime bookmarkedAt) {
        this.student = student;
        this.resource = resource;
        this.bookmarkedAt = bookmarkedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public LocalDateTime getBookmarkedAt() { return bookmarkedAt; }
    public void setBookmarkedAt(LocalDateTime bookmarkedAt) { this.bookmarkedAt = bookmarkedAt; }
}
