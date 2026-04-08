package com.eduvault.backend.repository;

import com.eduvault.backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, String> {
}
