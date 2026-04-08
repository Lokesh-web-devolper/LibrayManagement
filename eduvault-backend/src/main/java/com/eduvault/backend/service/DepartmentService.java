package com.eduvault.backend.service;

import com.eduvault.backend.entity.Department;
import com.eduvault.backend.repository.DepartmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public Department create(Department department) {
        return departmentRepository.save(department);
    }

    public Department getById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }
}
