package com.eduvault.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stats")
public class Stats {

    @Id
    private Long id;
    private Integer totalResources = 0;
    private Integer totalUsers = 0;
    private Integer totalDownloads = 0;
    private Integer pendingApprovals = 0;

    public Stats() {}

    public Stats(Long id, Integer totalResources, Integer totalUsers, Integer totalDownloads, Integer pendingApprovals) {
        this.id = id;
        this.totalResources = totalResources;
        this.totalUsers = totalUsers;
        this.totalDownloads = totalDownloads;
        this.pendingApprovals = pendingApprovals;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getTotalResources() { return totalResources; }
    public void setTotalResources(Integer totalResources) { this.totalResources = totalResources; }
    public Integer getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Integer totalUsers) { this.totalUsers = totalUsers; }
    public Integer getTotalDownloads() { return totalDownloads; }
    public void setTotalDownloads(Integer totalDownloads) { this.totalDownloads = totalDownloads; }
    public Integer getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(Integer pendingApprovals) { this.pendingApprovals = pendingApprovals; }
}
