package com.mrca.hub.dto;

public class UploadDto {
    private String title;
    private String subject;
    private String groupName;
    private String year;
    private String semester;
    private String type;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}