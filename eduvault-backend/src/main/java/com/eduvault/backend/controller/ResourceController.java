package com.eduvault.backend.controller;

import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAll();
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getById(id);
    }

    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.create(resource);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable String id, @RequestBody Resource resource) {
        return resourceService.update(id, resource);
    }

    @PatchMapping("/{id}")
    public Resource patchResource(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return resourceService.patch(id, updates);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable String id) {
        resourceService.delete(id);
    }
}
