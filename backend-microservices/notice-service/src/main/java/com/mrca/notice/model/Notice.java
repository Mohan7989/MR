package com.mrca.notice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Data
public class Notice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 300)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "is_urgent")
    private Boolean isUrgent = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
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