package com.eduvault.backend.dto;

public class CreateUserRequest {

    private String name;
    private String email;
    private String password;
    private String department;
    private String semester;
    private Boolean isActive;
    private String avatar;

    public CreateUserRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
