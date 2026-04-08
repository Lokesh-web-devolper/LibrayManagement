package com.eduvault.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

    @Id
    private String id;
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;
    private String semester;
    private String department;
    private Boolean isActive = true;

    public Student() {}

    public Student(String id, String name, String email, String password, String avatar, String semester, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.semester = semester;
        this.isActive = isActive;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
