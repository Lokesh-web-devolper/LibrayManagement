package com.eduvault.backend.service;

import com.eduvault.backend.entity.Resource;
import com.eduvault.backend.repository.ResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final StatsService statsService;

    public ResourceService(ResourceRepository resourceRepository, StatsService statsService) {
        this.resourceRepository = resourceRepository;
        this.statsService = statsService;
    }

    public List<Resource> getAll() {
        return resourceRepository.findAll();
    }

    public Resource getById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
    }

    public Resource create(Resource resource) {
        if (resource.getDownloads() == null) resource.setDownloads(0);
        Resource saved = resourceRepository.save(resource);
        statsService.recalculateAndSave();
        return saved;
    }

    public Resource update(String id, Resource resource) {
        Resource existing = getById(id);
        existing.setFileName(resource.getFileName());
        existing.setSubject(resource.getSubject());
        existing.setSemester(resource.getSemester());
        existing.setFileType(resource.getFileType());
        existing.setDownloads(resource.getDownloads());
        existing.setUploadDate(resource.getUploadDate());
        existing.setUploader(resource.getUploader());
        existing.setCategory(resource.getCategory());
        existing.setTags(resource.getTags());
        existing.setStatus(resource.getStatus());
        existing.setDescription(resource.getDescription());
        existing.setSize(resource.getSize());
        existing.setPages(resource.getPages());
        existing.setLanguage(resource.getLanguage());
        existing.setFileUrl(resource.getFileUrl());
        Resource saved = resourceRepository.save(existing);
        statsService.recalculateAndSave();
        return saved;
    }

    public Resource patch(String id, Map<String, Object> updates) {
        Resource resource = getById(id);
        updates.forEach((key, value) -> {
            try {
                Field field = Resource.class.getDeclaredField(key);
                field.setAccessible(true);
                field.set(resource, value);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid field: " + key);
            }
        });
        Resource saved = resourceRepository.save(resource);
        statsService.recalculateAndSave();
        return saved;
    }

    public void delete(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
        }
        resourceRepository.deleteById(id);
        statsService.recalculateAndSave();
    }
}
