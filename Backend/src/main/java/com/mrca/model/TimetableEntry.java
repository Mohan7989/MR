package src.main.java.com.mrca.model;



import jakarta.persistence.*;

@Entity
@Table(name = "timetable_entries")
public class TimetableEntry {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String dateDay;
  private String ba;
  private String bsc;
  private String bcom;
  private String bba;
  private String header; // e.g., "III B.A., B.Sc., ... OCTOBER 2025"
  private String time;   // "10 A.M. to 12.30 P.M."
  private int rotationGroup; // 1..3 indicates which timetable variant
  // getters/setters
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getDateDay(){return dateDay;}
  public void setDateDay(String d){this.dateDay=d;}
  public String getBa(){return ba;}
  public void setBa(String v){this.ba=v;}
  public String getBsc(){return bsc;}
  public void setBsc(String v){this.bsc=v;}
  public String getBcom(){return bcom;}
  public void setBcom(String v){this.bcom=v;}
  public String getBba(){return bba;}
  public void setBba(String v){this.bba=v;}
  public String getHeader(){return header;}
  public void setHeader(String h){this.header=h;}
  public String getTime(){return time;}
  public void setTime(String t){this.time=t;}
  public int getRotationGroup(){return rotationGroup;}
  public void setRotationGroup(int g){this.rotationGroup=g;}
}