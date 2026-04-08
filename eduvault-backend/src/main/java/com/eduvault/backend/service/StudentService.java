package com.eduvault.backend.service;

import com.eduvault.backend.dto.CreateUserRequest;
import com.eduvault.backend.dto.StudentQuickStatsResponse;
import com.eduvault.backend.dto.UserResponse;
import com.eduvault.backend.entity.Student;
import com.eduvault.backend.repository.BookmarkRepository;
import com.eduvault.backend.repository.DownloadHistoryRepository;
import com.eduvault.backend.repository.ResourceRepository;
import com.eduvault.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StatsService statsService;
    private final ResourceRepository resourceRepository;
    private final DownloadHistoryRepository downloadHistoryRepository;
    private final BookmarkRepository bookmarkRepository;

    public StudentService(StudentRepository studentRepository,
                          StatsService statsService,
                          ResourceRepository resourceRepository,
                          DownloadHistoryRepository downloadHistoryRepository,
                          BookmarkRepository bookmarkRepository) {
        this.studentRepository = studentRepository;
        this.statsService = statsService;
        this.resourceRepository = resourceRepository;
        this.downloadHistoryRepository = downloadHistoryRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    public List<Student> getAll(String email, String password) {
        if (email != null && password != null) {
            return studentRepository.findByEmailAndPasswordOrderByNameAsc(email, password);
        }
        return studentRepository.findAll();
    }

    public Student getById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    public Student create(Student student) {
        Student saved = studentRepository.save(student);
        statsService.recalculateAndSave();
        return saved;
    }

    public void delete(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        studentRepository.deleteById(id);
        statsService.recalculateAndSave();
    }

    public Student login(String email, String password) {
        Student student = studentRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        // Check if account is active
        if (student.getIsActive() == null || !student.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your account is inactive. Please contact the administrator.");
        }
        return student;
    }

    public StudentQuickStatsResponse getQuickStats(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + studentId);
        }
        long totalResources = resourceRepository.findAll().stream()
                .filter(r -> "approved".equalsIgnoreCase(r.getStatus()))
                .count();
        long myDownloads = downloadHistoryRepository.countByStudentId(studentId);
        long bookmarked  = bookmarkRepository.countByStudentId(studentId);
        return new StudentQuickStatsResponse(totalResources, myDownloads, bookmarked);
    }

    // ── Admin User Management Methods ──────────────────────────────────────

    /** Get all users, with optional name/email search */
    public List<UserResponse> getAllUsers(String q) {
        List<Student> students;
        if (q != null && !q.isBlank()) {
            students = studentRepository.searchByNameOrEmail(q.trim());
        } else {
            students = studentRepository.findAll();
        }
        return students.stream().map(UserResponse::from).collect(Collectors.toList());
    }

    /** Get single user as UserResponse */
    public UserResponse getUserById(String id) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.from(s);
    }

    /** Create a new user (admin action) */
    public UserResponse createUser(CreateUserRequest req) {
        if (studentRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A user with email '" + req.getEmail() + "' already exists.");
        }

        Student s = new Student();
        // Auto-generate STU ID using timestamp suffix
        s.setId("STU" + System.currentTimeMillis() % 100000);
        s.setName(req.getName());
        s.setEmail(req.getEmail());
        s.setPassword(req.getPassword());
        s.setDepartment(req.getDepartment());
        s.setSemester(req.getSemester());
        s.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        s.setAvatar(req.getAvatar() != null && !req.getAvatar().isBlank()
                ? req.getAvatar()
                : generateAvatar(req.getName()));

        Student saved = studentRepository.save(s);
        statsService.recalculateAndSave();
        return UserResponse.from(saved);
    }

    /** Update an existing user */
    public UserResponse updateUser(String id, CreateUserRequest req) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // If email is changing, check it doesn't clash with another user
        if (!s.getEmail().equalsIgnoreCase(req.getEmail())
                && studentRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Email '" + req.getEmail() + "' is already used by another user.");
        }

        s.setName(req.getName());
        s.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            s.setPassword(req.getPassword());
        }
        s.setDepartment(req.getDepartment());
        s.setSemester(req.getSemester());
        if (req.getIsActive() != null) s.setIsActive(req.getIsActive());
        if (req.getAvatar() != null && !req.getAvatar().isBlank()) {
            s.setAvatar(req.getAvatar());
        }

        return UserResponse.from(studentRepository.save(s));
    }

    /** Toggle isActive status */
    public UserResponse toggleStatus(String id) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        s.setIsActive(s.getIsActive() == null || !s.getIsActive());
        return UserResponse.from(studentRepository.save(s));
    }

    /** Delete user by ID */
    public void deleteUser(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        studentRepository.deleteById(id);
        statsService.recalculateAndSave();
    }

    // Generate 2-letter avatar initials
    private String generateAvatar(String name) {
        if (name == null || name.isBlank()) return "ST";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
