package com.mrca.llm.model;

import lombok.Data;
import java.util.Map;

@Data
public class ResultCheckResponse {
    private boolean found;
    private String rollNumber;
    private String studentName;
    private String resultStatus; // Pass/Fail/Not Found/Pending
    private String message;
    private String examName;
    private String resultLink;
    private Map<String, Object> additionalData;
    
    public static ResultCheckResponse notFound(String rollNumber) {
        ResultCheckResponse response = new ResultCheckResponse();
        response.setFound(false);
        response.setRollNumber(rollNumber);
        response.setResultStatus("Not Found");
        response.setMessage("Result not found for roll number: " + rollNumber + 
                          ". Please check the roll number and try again, or visit the official website.");
        return response;
    }
    
    public static ResultCheckResponse error(String rollNumber, String errorMessage) {
        ResultCheckResponse response = new ResultCheckResponse();
        response.setFound(false);
        response.setRollNumber(rollNumber);
        response.setResultStatus("Error");
        response.setMessage("Error checking result: " + errorMessage);
        return response;
    }
}