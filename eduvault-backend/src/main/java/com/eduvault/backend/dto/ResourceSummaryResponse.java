package com.eduvault.backend.dto;

import java.util.List;

public class ResourceSummaryResponse {
    private String id;
    private String fileName;
    private String subject;
    private String semester;
    private String fileType;
    private Integer downloads;
    private String uploadDate;
    private String category;
    private List<String> tags;
    private String fileUrl;
    private String size;
    private String description;

    public ResourceSummaryResponse() {}

    public ResourceSummaryResponse(String id, String fileName, String subject, String semester,
                                   String fileType, Integer downloads, String uploadDate,
                                   String category, List<String> tags, String fileUrl,
                                   String size, String description) {
        this.id = id;
        this.fileName = fileName;
        this.subject = subject;
        this.semester = semester;
        this.fileType = fileType;
        this.downloads = downloads;
        this.uploadDate = uploadDate;
        this.category = category;
        this.tags = tags;
        this.fileUrl = fileUrl;
        this.size = size;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Integer getDownloads() { return downloads; }
    public void setDownloads(Integer downloads) { this.downloads = downloads; }
    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
