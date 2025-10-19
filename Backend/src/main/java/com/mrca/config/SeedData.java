package src.main.java.com.mrca.config;



import com.mrca.model.*;
import com.mrca.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class SeedData {
  @Bean
  CommandLineRunner seed(MaterialRepo m, UpdateRepo up, NoticeRepo n, TimetableRepo tt, InternshipRepo i){
    return args -> {
      if (up.count()==0){
        up.save(new UpdateItem(){{
          setText("International Opportunities Available for Students");
        }});
        up.save(new UpdateItem(){{
          setText("Upcoming Events and Workshops");
        }});
        up.save(new UpdateItem(){{
          setText("Semester Results Released");
        }});
        up.save(new UpdateItem(){{
          setText("Semester Notes Regarding Exam Dates");
        }});
      }
      if (n.count()==0){
        Notice no = new Notice();
        no.setTitle("Important Notice Regarding Exam Dates");
        no.setBody("Please check the updated exam dates in the timetable section. All students are advised to prepare accordingly.");
        n.save(no);
      }
      if (tt.count()==0){
        String hdr = "III B.A., B.Sc., B.Com & B.B.A. Degree FIFTH SEMESTER - END (Supplementary) 20-22 Series Examinations OCTOBER 2025";
        String time = "10 A.M. to 12.30 P.M.";
        // Add entries for rotationGroup 1 (sample few lines)
        TimetableEntry e1 = new TimetableEntry();
        e1.setHeader(hdr); e1.setTime(time); e1.setRotationGroup(1);
        e1.setDateDay("28-10-2025 Tuesday");
        e1.setBa("Economics - VII (Banking and Financial Services)");
        e1.setBsc("Mathematics - VI (Numerical Methods); Botany - VI (Plant Tissue Culture)");
        e1.setBcom("Management Accounting & Practice");
        e1.setBba("Global Human Resource Management");
        tt.save(e1);

        TimetableEntry e2 = new TimetableEntry();
        e2.setHeader(hdr); e2.setTime(time); e2.setRotationGroup(1);
        e2.setDateDay("29-10-2025 Wednesday");
        e2.setBa("History - VII (Tourism Guidance and Operating Skills)");
        e2.setBsc("Mathematics - VII (Mathematical Special Functions); Botany - VII (Mushroom Cultivation)");
        e2.setBcom("Cost Control Techniques");
        e2.setBba("e-Payment System");
        tt.save(e2);

        // rotationGroup 2 & 3 dummy lines
        for (int g=2; g<=3; g++){
          TimetableEntry eg = new TimetableEntry();
          eg.setHeader(hdr); eg.setTime(time); eg.setRotationGroup(g);
          eg.setDateDay("30-10-2025 Thursday"); eg.setBa(""); 
          eg.setBsc("Physics - VI (Applications of Electricity & Electronics); Zoology - VI (Sustainable Aquaculture Management)");
          eg.setBcom("Life Insurance with Practice"); eg.setBba("");
          tt.save(eg);
        }
      }
      if (m.count()==0){
        Material p = new Material();
        p.setTitle("Physics Question Paper");
        p.setSubject("Physics"); p.setGroupName("B.Sc"); p.setSemester("1"); p.setYear("2023");
        p.setType(MaterialType.QUESTION_PAPER);
        p.setFilePath("/data/uploads/sample.pdf"); p.setPreviewUrl("/data/uploads/sample.pdf");
        m.save(p);
      }
      if (i.count()==0){
        Internship in1 = new Internship();
        in1.setTitle("Software Intern - Web");
        in1.setCompany("TechNova");
        in1.setLocation("Hyderabad, TG");
        in1.setApplyLink("https://example.com/apply");
        in1.setDeadline(LocalDate.now().plusDays(30));
        in1.setDescription("Work on React/Vite components and Spring Boot APIs.");
        i.save(in1);
      }
    };
  }
}
