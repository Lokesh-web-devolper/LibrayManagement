package com.eduvault.backend.controller;

import com.eduvault.backend.entity.Admin;
import com.eduvault.backend.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<Admin> getAllAdmins(@RequestParam(required = false) String email,
                                    @RequestParam(required = false) String password) {
        return adminService.getAll(email, password);
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable String id) {
        return adminService.getById(id);
    }

    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.create(admin);
    }
}
