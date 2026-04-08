package com.eduvault.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookmarkResponse {
    private Long id;
    private String resourceId;
    private String fileName;
    private String fileType;
    private String subject;
    private String semester;
    private Integer downloads;
    private String uploadDate;
    private LocalDateTime bookmarkedAt;
    private List<String> tags;
    private String fileUrl;
    private String category;
    private String size;
    private String description;

    public BookmarkResponse() {}

    public BookmarkResponse(Long id, String resourceId, String fileName, String fileType,
                            String subject, String semester, Integer downloads, String uploadDate,
                            LocalDateTime bookmarkedAt, List<String> tags, String fileUrl,
                            String category, String size, String description) {
        this.id = id;
        this.resourceId = resourceId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.subject = subject;
        this.semester = semester;
        this.downloads = downloads;
        this.uploadDate = uploadDate;
        this.bookmarkedAt = bookmarkedAt;
        this.tags = tags;
        this.fileUrl = fileUrl;
        this.category = category;
        this.size = size;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public Integer getDownloads() { return downloads; }
    public void setDownloads(Integer downloads) { this.downloads = downloads; }
    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }
    public LocalDateTime getBookmarkedAt() { return bookmarkedAt; }
    public void setBookmarkedAt(LocalDateTime bookmarkedAt) { this.bookmarkedAt = bookmarkedAt; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
