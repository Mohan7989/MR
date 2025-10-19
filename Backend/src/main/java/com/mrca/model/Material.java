package src.main.java.com.mrca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
public class Material {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String subject;
  private String groupName;
  private String semester;
  private String year;
  @Enumerated(EnumType.STRING)
  private MaterialType type;

  private String filePath;     // stored path on disk
  private String previewUrl;   // same as file path served via /files

  private boolean approved = true; // true for seeded/public items
  private LocalDateTime createdAt = LocalDateTime.now();

  // getters/setters
  // ...
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getSubject() { return subject; }
  public void setSubject(String subject) { this.subject = subject; }
  public String getGroupName() { return groupName; }
  public void setGroupName(String groupName) { this.groupName = groupName; }
  public String getSemester() { return semester; }
  public void setSemester(String semester) { this.semester = semester; }
  public String getYear() { return year; }
  public void setYear(String year) { this.year = year; }
  public MaterialType getType() { return type; }
  public void setType(MaterialType type) { this.type = type; }
  public String getFilePath() { return filePath; }
  public void setFilePath(String filePath) { this.filePath = filePath; }
  public String getPreviewUrl() { return previewUrl; }
  public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
  public boolean isApproved() { return approved; }
  public void setApproved(boolean approved) { this.approved = approved; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}