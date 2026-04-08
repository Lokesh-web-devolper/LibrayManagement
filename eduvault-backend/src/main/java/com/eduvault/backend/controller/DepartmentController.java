package com.eduvault.backend.controller;

import com.eduvault.backend.entity.Department;
import com.eduvault.backend.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAll();
    }

    @GetMapping("/{id}")
    public Department getDepartmentById(@PathVariable String id) {
        return departmentService.getById(id);
    }

    @PostMapping
    public Department createDepartment(@RequestBody Department department) {
        return departmentService.create(department);
    }
}
