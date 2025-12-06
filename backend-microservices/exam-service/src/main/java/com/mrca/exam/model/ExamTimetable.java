package com.mrca.exam.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Data;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam_timetables")
@Data
public class ExamTimetable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(length = 300)
    private String subtitle;
    
    @Column(length = 100)
    private String batch;
    
    @Column(columnDefinition = "JSON")
    private String scheduleJson;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
    // Transient field for JSON processing
    @Transient
    private List<ScheduleEntry> schedule;
    
    @Data
    public static class ScheduleEntry {
        private String date;
        private String day;
        private String baSubject;
        private String bscSubject;
        private String bcomSubject;
        private String bbaSubject;
    }
    
    @PostLoad
    @PostPersist
    @PostUpdate
    private void loadSchedule() {
        if (scheduleJson != null && !scheduleJson.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                this.schedule = mapper.readValue(scheduleJson, new TypeReference<List<ScheduleEntry>>() {});
            } catch (IOException e) {
                this.schedule = List.of();
            }
        }
    }
    
    @PrePersist
    @PreUpdate
    private void saveSchedule() {
        if (schedule != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                this.scheduleJson = mapper.writeValueAsString(schedule);
            } catch (IOException e) {
                this.scheduleJson = "[]";
            }
        }
    }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}