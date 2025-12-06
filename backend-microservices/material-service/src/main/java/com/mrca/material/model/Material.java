package com.mrca.material.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Data
public class Material {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(nullable = false, length = 200)
    private String subject;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Group group;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Semester semester;
    
    @Column(length = 10)
    private String year;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "material_type", nullable = false)
    private MaterialType materialType;
    
    @Column(name = "file_url", nullable = false, length = 1000)
    private String fileUrl;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    
    private Integer downloads = 0;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
    public enum Group {
        BA("B.A"), BSC("B.Sc"), BCOM("B.Com"), BBA("B.B.A"), ALL("All");
        
        private final String displayName;
        
        Group(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Semester {
        FIRST("1st"), SECOND("2nd"), THIRD("3rd"), 
        FOURTH("4th"), FIFTH("5th"), SIXTH("6th");
        
        private final String displayName;
        
        Semester(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum MaterialType {
        QUESTION_PAPER("Question Paper"),
        NOTES("Notes"),
        LAB_MATERIAL("Lab Material"),
        INTERNSHIP("Internship"),
        OTHER("Other");
        
        private final String displayName;
        
        MaterialType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Status {
        PENDING, APPROVED, REJECTED
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