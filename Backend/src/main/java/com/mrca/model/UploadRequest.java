package src.main.java.com.mrca.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "upload_requests")
public class UploadRequest {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String title;
  private String subject;
  private String groupName;
  private String semester;
  private String year;
  @Enumerated(EnumType.STRING)
  private MaterialType type;
  private String tempFilePath;
  private boolean copyrightConfirmed;
  private LocalDateTime submittedAt = LocalDateTime.now();
  private boolean approved = false;
  private boolean rejected = false;

  // getters/setters
  // ...
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getTitle(){return title;}
  public void setTitle(String title){this.title=title;}
  public String getSubject(){return subject;}
  public void setSubject(String subject){this.subject=subject;}
  public String getGroupName(){return groupName;}
  public void setGroupName(String groupName){this.groupName=groupName;}
  public String getSemester(){return semester;}
  public void setSemester(String semester){this.semester=semester;}
  public String getYear(){return year;}
  public void setYear(String year){this.year=year;}
  public MaterialType getType(){return type;}
  public void setType(MaterialType type){this.type=type;}
  public String getTempFilePath(){return tempFilePath;}
  public void setTempFilePath(String tempFilePath){this.tempFilePath=tempFilePath;}
  public boolean isCopyrightConfirmed(){return copyrightConfirmed;}
  public void setCopyrightConfirmed(boolean v){this.copyrightConfirmed=v;}
  public LocalDateTime getSubmittedAt(){return submittedAt;}
  public void setSubmittedAt(LocalDateTime t){this.submittedAt=t;}
  public boolean isApproved(){return approved;}
  public void setApproved(boolean a){this.approved=a;}
  public boolean isRejected(){return rejected;}
  public void setRejected(boolean r){this.rejected=r;}
}
