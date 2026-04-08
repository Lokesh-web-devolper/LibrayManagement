package com.eduvault.backend.service;

import com.eduvault.backend.dto.CategoryResponse;
import com.eduvault.backend.dto.ResourceSummaryResponse;
import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final ResourceRepository resourceRepository;

    // Category metadata: name -> [iconKey, gradientStart, gradientEnd]
    private static final Map<String, String[]> CATEGORY_META = new LinkedHashMap<>();

    static {
        CATEGORY_META.put("Computer Science",   new String[]{"code",        "#6366f1", "#8b5cf6"});
        CATEGORY_META.put("Mathematics",        new String[]{"calculator",  "#7c3aed", "#a855f7"});
        CATEGORY_META.put("Engineering",        new String[]{"box",         "#db2777", "#f97316"});
        CATEGORY_META.put("Physics",            new String[]{"sparkles",    "#be185d", "#e11d48"});
        CATEGORY_META.put("Chemistry",          new String[]{"flask",       "#0d9488", "#06b6d4"});
        CATEGORY_META.put("Literature",         new String[]{"book",        "#ea580c", "#f59e0b"});
        CATEGORY_META.put("Lecture Notes",      new String[]{"file-text",   "#4f46e5", "#7c3aed"});
        CATEGORY_META.put("Study Material",     new String[]{"layers",      "#0891b2", "#0d9488"});
        CATEGORY_META.put("Reference Material", new String[]{"bookmark",    "#16a34a", "#15803d"});
        CATEGORY_META.put("Past Papers",        new String[]{"archive",     "#b45309", "#d97706"});
    }

    private static final String[] FALLBACK_META = {"folder", "#64748b", "#94a3b8"};

    public CategoryService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        List<Resource> allResources = resourceRepository.findAll();

        // Group by category, only approved resources
        Map<String, Long> countByCategory = allResources.stream()
                .filter(r -> "approved".equalsIgnoreCase(r.getStatus()))
                .filter(r -> r.getCategory() != null && !r.getCategory().isBlank())
                .collect(Collectors.groupingBy(Resource::getCategory, Collectors.counting()));

        if (countByCategory.isEmpty()) {
            return Collections.emptyList();
        }

        // Sort by count descending to determine trending
        List<Map.Entry<String, Long>> sorted = countByCategory.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());

        // Top 2 categories are "trending"
        Set<String> trendingNames = new HashSet<>();
        for (int i = 0; i < Math.min(2, sorted.size()); i++) {
            trendingNames.add(sorted.get(i).getKey());
        }

        return sorted.stream().map(entry -> {
            String name = entry.getKey();
            long count = entry.getValue();
            String[] meta = CATEGORY_META.getOrDefault(name, FALLBACK_META);
            return new CategoryResponse(
                    name,
                    meta[0],
                    meta[0],          // colorTheme same as iconKey for simplicity
                    meta[1],          // gradientStart
                    meta[2],          // gradientEnd
                    count,
                    trendingNames.contains(name)
            );
        }).collect(Collectors.toList());
    }

    public List<ResourceSummaryResponse> getResourcesByCategory(String categoryName) {
        return resourceRepository.findAll().stream()
                .filter(r -> "approved".equalsIgnoreCase(r.getStatus()))
                .filter(r -> categoryName != null && categoryName.equalsIgnoreCase(r.getCategory()))
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    private ResourceSummaryResponse toSummary(Resource r) {
        return new ResourceSummaryResponse(
                r.getId(),
                r.getFileName(),
                r.getSubject(),
                r.getSemester(),
                r.getFileType(),
                r.getDownloads(),
                r.getUploadDate(),
                r.getCategory(),
                r.getTags(),
                r.getFileUrl(),
                r.getSize(),
                r.getDescription()
        );
    }
}
