package com.eduvault.backend.controller;

import com.eduvault.backend.dto.CreateUserRequest;
import com.eduvault.backend.dto.UserResponse;
import com.eduvault.backend.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin User Management Controller
 * Base path: /api/admin/users
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final StudentService studentService;

    public AdminUserController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * GET /api/admin/users
     * GET /api/admin/users?q=searchTerm
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(studentService.getAllUsers(q));
    }

    /**
     * GET /api/admin/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getUserById(id));
    }

    /**
     * POST /api/admin/users
     * Create a new user
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        UserResponse created = studentService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/admin/users/{id}
     * Update an existing user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(studentService.updateUser(id, request));
    }

    /**
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        studentService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/admin/users/{id}/toggle-status
     * Toggle isActive (active ↔ inactive)
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserResponse> toggleStatus(@PathVariable String id) {
        return ResponseEntity.ok(studentService.toggleStatus(id));
    }
}
