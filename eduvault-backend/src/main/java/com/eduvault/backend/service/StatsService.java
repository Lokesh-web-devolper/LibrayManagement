package com.eduvault.backend.service;

import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.entity.Stats;
import com.eduvault.backend.repository.ResourceRepository;
import com.eduvault.backend.repository.StatsRepository;
import com.eduvault.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final StatsRepository statsRepository;
    private final ResourceRepository resourceRepository;
    private final StudentRepository studentRepository;

    public StatsService(StatsRepository statsRepository, ResourceRepository resourceRepository, StudentRepository studentRepository) {
        this.statsRepository = statsRepository;
        this.resourceRepository = resourceRepository;
        this.studentRepository = studentRepository;
    }

    public Stats recalculateAndSave() {
        Stats stats = statsRepository.findById(1L).orElse(new Stats(1L, 0, 0, 0, 0));
        int totalResources = (int) resourceRepository.count();
        int totalUsers = (int) studentRepository.count();
        int totalDownloads = resourceRepository.findAll().stream()
                .map(Resource::getDownloads)
                .filter(java.util.Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();
        int pending = (int) resourceRepository.findAll().stream()
                .filter(r -> "pending".equalsIgnoreCase(r.getStatus()))
                .count();

        stats.setTotalResources(totalResources);
        stats.setTotalUsers(totalUsers);
        stats.setTotalDownloads(totalDownloads);
        stats.setPendingApprovals(pending);
        return statsRepository.save(stats);
    }

    public Stats getStats() {
        return recalculateAndSave();
    }

    public Stats patchStats(Stats incoming) {
        Stats stats = statsRepository.findById(1L).orElse(new Stats(1L, 0, 0, 0, 0));
        if (incoming.getTotalResources() != null) stats.setTotalResources(incoming.getTotalResources());
        if (incoming.getTotalUsers() != null) stats.setTotalUsers(incoming.getTotalUsers());
        if (incoming.getTotalDownloads() != null) stats.setTotalDownloads(incoming.getTotalDownloads());
        if (incoming.getPendingApprovals() != null) stats.setPendingApprovals(incoming.getPendingApprovals());
        return statsRepository.save(stats);
    }
}
