package com.eduvault.backend.dto;

public class CategoryResponse {
    private String name;
    private String iconKey;
    private String colorTheme;
    private String gradientStart;
    private String gradientEnd;
    private long resourceCount;
    private boolean trending;

    public CategoryResponse() {}

    public CategoryResponse(String name, String iconKey, String colorTheme,
                            String gradientStart, String gradientEnd,
                            long resourceCount, boolean trending) {
        this.name = name;
        this.iconKey = iconKey;
        this.colorTheme = colorTheme;
        this.gradientStart = gradientStart;
        this.gradientEnd = gradientEnd;
        this.resourceCount = resourceCount;
        this.trending = trending;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIconKey() { return iconKey; }
    public void setIconKey(String iconKey) { this.iconKey = iconKey; }
    public String getColorTheme() { return colorTheme; }
    public void setColorTheme(String colorTheme) { this.colorTheme = colorTheme; }
    public String getGradientStart() { return gradientStart; }
    public void setGradientStart(String gradientStart) { this.gradientStart = gradientStart; }
    public String getGradientEnd() { return gradientEnd; }
    public void setGradientEnd(String gradientEnd) { this.gradientEnd = gradientEnd; }
    public long getResourceCount() { return resourceCount; }
    public void setResourceCount(long resourceCount) { this.resourceCount = resourceCount; }
    public boolean isTrending() { return trending; }
    public void setTrending(boolean trending) { this.trending = trending; }
}
