package com.eduvault.backend.repository;

import com.eduvault.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByEmailAndPassword(String email, String password);
    List<Admin> findByEmailAndPasswordOrderByNameAsc(String email, String password);
}
