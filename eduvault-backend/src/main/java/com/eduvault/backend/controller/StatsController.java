package com.eduvault.backend.controller;

import com.eduvault.backend.entity.Stats;
import com.eduvault.backend.service.StatsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/{id}")
    public Stats getStats(@PathVariable Long id) {
        return statsService.getStats();
    }

    @PatchMapping("/{id}")
    public Stats patchStats(@PathVariable Long id, @RequestBody Stats stats) {
        return statsService.patchStats(stats);
    }
}
