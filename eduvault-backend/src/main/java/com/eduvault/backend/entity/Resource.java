package com.eduvault.backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    private String id;

    @Column(nullable = false)
    private String fileName;
    private String subject;
    private String semester;
    private String fileType;
    private Integer downloads = 0;
    private String uploadDate;
    private String uploader;
    private String category;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String size;
    private Integer pages;
    private String language;
    private String fileUrl;

    @ElementCollection
    @CollectionTable(name = "resource_tags", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    public Resource() {}

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
    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
