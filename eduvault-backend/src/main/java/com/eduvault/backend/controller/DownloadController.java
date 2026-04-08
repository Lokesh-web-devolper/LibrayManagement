package com.eduvault.backend.controller;

import com.eduvault.backend.dto.DownloadHistoryResponse;
import com.eduvault.backend.service.DownloadHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/{studentId}/downloads")
public class DownloadController {

    private final DownloadHistoryService downloadHistoryService;

    public DownloadController(DownloadHistoryService downloadHistoryService) {
        this.downloadHistoryService = downloadHistoryService;
    }

    /**
     * GET /api/student/{studentId}/downloads?filter=all|today|week|month
     */
    @GetMapping
    public ResponseEntity<List<DownloadHistoryResponse>> getDownloads(
            @PathVariable String studentId,
            @RequestParam(defaultValue = "all") String filter) {
        return ResponseEntity.ok(downloadHistoryService.getDownloads(studentId, filter));
    }

    /**
     * POST /api/student/{studentId}/downloads/{resourceId}
     * Records or increments a download entry.
     */
    @PostMapping("/{resourceId}")
    public ResponseEntity<DownloadHistoryResponse> recordDownload(
            @PathVariable String studentId,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(downloadHistoryService.recordDownload(studentId, resourceId));
    }

    /**
     * GET /api/student/{studentId}/downloads/stats
     * Returns total unique resources downloaded by student.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@PathVariable String studentId) {
        long count = downloadHistoryService.getTotalDownloads(studentId);
        return ResponseEntity.ok(Map.of("totalDownloads", count));
    }
}
