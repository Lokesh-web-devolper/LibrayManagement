package com.eduvault.backend.controller;

import com.eduvault.backend.dto.BookmarkResponse;
import com.eduvault.backend.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/{studentId}/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    
    @GetMapping
    public ResponseEntity<List<BookmarkResponse>> getBookmarks(@PathVariable String studentId) {
        return ResponseEntity.ok(bookmarkService.getBookmarks(studentId));
    }

    /**
     * POST /api/student/{studentId}/bookmarks/{resourceId}
     * Adds a bookmark. Duplicate-safe — returns existing bookmark if already bookmarked.
     */
    @PostMapping("/{resourceId}")
    public ResponseEntity<BookmarkResponse> addBookmark(
            @PathVariable String studentId,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(bookmarkService.addBookmark(studentId, resourceId));
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Map<String, String>> removeBookmark(
            @PathVariable String studentId,
            @PathVariable String resourceId) {
        bookmarkService.removeBookmark(studentId, resourceId);
        return ResponseEntity.ok(Map.of("message", "Bookmark removed successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@PathVariable String studentId) {
        long count = bookmarkService.getBookmarkCount(studentId);
        return ResponseEntity.ok(Map.of("bookmarked", count));
    }
}
