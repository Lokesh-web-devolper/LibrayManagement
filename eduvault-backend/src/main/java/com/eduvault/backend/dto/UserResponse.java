package com.eduvault.backend.dto;

import com.eduvault.backend.entity.Student;

public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String avatar;
    private String semester;
    private String department;
    private Boolean isActive;

    public UserResponse() {}

    public static UserResponse from(Student s) {
        UserResponse r = new UserResponse();
        r.id = s.getId();
        r.name = s.getName();
        r.email = s.getEmail();
        r.avatar = s.getAvatar();
        r.semester = s.getSemester();
        r.department = s.getDepartment();
        r.isActive = s.getIsActive();
        return r;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
