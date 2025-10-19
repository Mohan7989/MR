package src.main.java.com.mrca.model;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "updates")
public class UpdateItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String text;
  private LocalDateTime createdAt = LocalDateTime.now();
  // getters/setters
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getText(){return text;}
  public void setText(String t){this.text=t;}
  public LocalDateTime getCreatedAt(){return createdAt;}
  public void setCreatedAt(LocalDateTime c){this.createdAt=c;}
}
