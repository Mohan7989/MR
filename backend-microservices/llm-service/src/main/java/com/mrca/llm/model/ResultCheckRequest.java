package com.mrca.llm.model;

import lombok.Data;

@Data
public class ResultCheckRequest {
    private String rollNumber;
    private String resultUrl;
    
    // Optional: Add more parameters if needed
    private String examName;
    private String year;
}
