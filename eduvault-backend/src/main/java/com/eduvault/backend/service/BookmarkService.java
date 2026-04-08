package com.eduvault.backend.service;

import com.eduvault.backend.dto.BookmarkResponse;
import com.eduvault.backend.entity.Bookmark;
import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.entity.Student;
import com.eduvault.backend.repository.BookmarkRepository;
import com.eduvault.backend.repository.ResourceRepository;
import com.eduvault.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final StudentRepository studentRepository;
    private final ResourceRepository resourceRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository,
                           StudentRepository studentRepository,
                           ResourceRepository resourceRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.studentRepository = studentRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<BookmarkResponse> getBookmarks(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }
        return bookmarkRepository.findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookmarkResponse addBookmark(String studentId, String resourceId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId));
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found: " + resourceId));

        // Skip duplicate — return existing
        return bookmarkRepository.findByStudentIdAndResourceId(studentId, resourceId)
                .map(this::toResponse)
                .orElseGet(() -> {
                    Bookmark bookmark = new Bookmark(student, resource, LocalDateTime.now());
                    return toResponse(bookmarkRepository.save(bookmark));
                });
    }

    @Transactional
    public void removeBookmark(String studentId, String resourceId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }
        if (!resourceRepository.existsById(resourceId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found: " + resourceId);
        }
        // Silently succeed even if bookmark did not exist
        if (bookmarkRepository.existsByStudentIdAndResourceId(studentId, resourceId)) {
            bookmarkRepository.deleteByStudentIdAndResourceId(studentId, resourceId);
        }
    }

    public boolean isBookmarked(String studentId, String resourceId) {
        return bookmarkRepository.existsByStudentIdAndResourceId(studentId, resourceId);
    }

    public long getBookmarkCount(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }
        return bookmarkRepository.countByStudentId(studentId);
    }

    private BookmarkResponse toResponse(Bookmark b) {
        Resource r = b.getResource();
        return new BookmarkResponse(
                b.getId(),
                r.getId(),
                r.getFileName(),
                r.getFileType(),
                r.getSubject(),
                r.getSemester(),
                r.getDownloads(),
                r.getUploadDate(),
                b.getBookmarkedAt(),
                r.getTags(),
                r.getFileUrl(),
                r.getCategory(),
                r.getSize(),
                r.getDescription()
        );
    }
}
