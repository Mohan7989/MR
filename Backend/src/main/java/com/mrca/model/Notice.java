package src.main.java.com.mrca.model;


import jakarta.persistence.*;

@Entity
@Table(name = "notices")
public class Notice {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String title;
  @Column(length = 4000)
  private String body;
  // getters/setters
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getTitle(){return title;}
  public void setTitle(String t){this.title=t;}
  public String getBody(){return body;}
  public void setBody(String b){this.body=b;}
}