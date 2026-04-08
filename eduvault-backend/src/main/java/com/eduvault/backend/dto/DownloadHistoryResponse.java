package com.eduvault.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DownloadHistoryResponse {
    private Long id;
    private String resourceId;
    private String fileName;
    private String fileType;
    private String category;
    private String subject;
    private String semester;
    private LocalDateTime downloadedAt;
    private Integer downloadCount;
    private String fileUrl;
    private List<String> tags;
    private String size;

    public DownloadHistoryResponse() {}

    public DownloadHistoryResponse(Long id, String resourceId, String fileName, String fileType,
                                   String category, String subject, String semester,
                                   LocalDateTime downloadedAt, Integer downloadCount,
                                   String fileUrl, List<String> tags, String size) {
        this.id = id;
        this.resourceId = resourceId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.category = category;
        this.subject = subject;
        this.semester = semester;
        this.downloadedAt = downloadedAt;
        this.downloadCount = downloadCount;
        this.fileUrl = fileUrl;
        this.tags = tags;
        this.size = size;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }
    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
