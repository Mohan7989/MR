package src.main.java.com.mrca.model;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "internships")
public class Internship {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String title;
  private String company;
  private String location;
  private String applyLink;
  private LocalDate deadline;
  @Column(length = 4000)
  private String description;

  // getters/setters...
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getTitle(){return title;}
  public void setTitle(String t){this.title=t;}
  public String getCompany(){return company;}
  public void setCompany(String c){this.company=c;}
  public String getLocation(){return location;}
  public void setLocation(String l){this.location=l;}
  public String getApplyLink(){return applyLink;}
  public void setApplyLink(String a){this.applyLink=a;}
  public LocalDate getDeadline(){return deadline;}
  public void setDeadline(LocalDate d){this.deadline=d;}
  public String getDescription(){return description;}
  public void setDescription(String d){this.description=d;}
}