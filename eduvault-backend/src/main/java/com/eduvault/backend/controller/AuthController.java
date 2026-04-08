package com.eduvault.backend.controller;

import com.eduvault.backend.dto.LoginRequest;
import com.eduvault.backend.entity.Admin;
import com.eduvault.backend.entity.Student;
import com.eduvault.backend.service.AdminService;
import com.eduvault.backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentService studentService;
    private final AdminService adminService;

    public AuthController(StudentService studentService, AdminService adminService) {
        this.studentService = studentService;
        this.adminService = adminService;
    }

    @PostMapping("/student/login")
    public Student studentLogin(@Valid @RequestBody LoginRequest request) {
        return studentService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/admin/login")
    public Admin adminLogin(@Valid @RequestBody LoginRequest request) {
        return adminService.login(request.getEmail(), request.getPassword());
    }
}
