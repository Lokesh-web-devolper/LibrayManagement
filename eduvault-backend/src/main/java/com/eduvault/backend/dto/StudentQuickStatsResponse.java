package com.eduvault.backend.dto;

public class StudentQuickStatsResponse {
    private long totalResources;
    private long myDownloads;
    private long bookmarked;

    public StudentQuickStatsResponse() {}

    public StudentQuickStatsResponse(long totalResources, long myDownloads, long bookmarked) {
        this.totalResources = totalResources;
        this.myDownloads = myDownloads;
        this.bookmarked = bookmarked;
    }

    public long getTotalResources() { return totalResources; }
    public void setTotalResources(long totalResources) { this.totalResources = totalResources; }
    public long getMyDownloads() { return myDownloads; }
    public void setMyDownloads(long myDownloads) { this.myDownloads = myDownloads; }
    public long getBookmarked() { return bookmarked; }
    public void setBookmarked(long bookmarked) { this.bookmarked = bookmarked; }
}
