package com.eduvault.backend.repository;

import com.eduvault.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> {

    Optional<Student> findByEmailAndPassword(String email, String password);

    List<Student> findByEmailAndPasswordOrderByNameAsc(String email, String password);

    boolean existsByEmail(String email);

    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Student> searchByNameOrEmail(@Param("q") String q);
}
