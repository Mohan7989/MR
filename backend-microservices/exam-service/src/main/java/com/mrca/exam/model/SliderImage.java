package com.mrca.exam.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "slider_images")
@Data
public class SliderImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;
    
    @Column(name = "order")
    private Integer order = 0;
    
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