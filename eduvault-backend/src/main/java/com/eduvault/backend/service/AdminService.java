package com.eduvault.backend.service;

import com.eduvault.backend.entity.Admin;
import com.eduvault.backend.repository.AdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<Admin> getAll(String email, String password) {
        if (email != null && password != null) {
            return adminRepository.findByEmailAndPasswordOrderByNameAsc(email, password);
        }
        return adminRepository.findAll();
    }

    public Admin getById(String id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
    }

    public Admin create(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin login(String email, String password) {
        return adminRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials"));
    }
}
