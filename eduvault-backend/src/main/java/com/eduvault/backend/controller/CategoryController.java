package com.eduvault.backend.controller;

import com.eduvault.backend.dto.CategoryResponse;
import com.eduvault.backend.dto.ResourceSummaryResponse;
import com.eduvault.backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

   
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    
    @GetMapping("/resources")
    public ResponseEntity<List<ResourceSummaryResponse>> getResourcesByCategory(
            @RequestParam String name) {
        return ResponseEntity.ok(categoryService.getResourcesByCategory(name));
    }
}
