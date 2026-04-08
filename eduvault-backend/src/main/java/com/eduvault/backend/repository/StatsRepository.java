package com.eduvault.backend.repository;

import com.eduvault.backend.entity.Stats;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatsRepository extends JpaRepository<Stats, Long> {
}
