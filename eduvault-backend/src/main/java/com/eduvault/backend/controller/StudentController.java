package com.eduvault.backend.controller;

import com.eduvault.backend.dto.StudentQuickStatsResponse;
import com.eduvault.backend.entity.Student;
import com.eduvault.backend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents(@RequestParam(required = false) String email,
                                        @RequestParam(required = false) String password) {
        return studentService.getAll(email, password);
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable String id) {
        return studentService.getById(id);
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.create(student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable String id) {
        studentService.delete(id);
    }

    @GetMapping("/{studentId}/quick-stats")
    public ResponseEntity<StudentQuickStatsResponse> getQuickStats(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getQuickStats(studentId));
    }
}
