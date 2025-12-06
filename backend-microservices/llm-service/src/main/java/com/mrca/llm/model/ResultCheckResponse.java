package com.mrca.llm.model;

import java.util.Map;

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

    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public String getResultLink() {
        return resultLink;
    }

    public void setResultLink(String resultLink) {
        this.resultLink = resultLink;
    }

    public Map<String, Object> getAdditionalData() {
        return additionalData;
    }

    public void setAdditionalData(Map<String, Object> additionalData) {
        this.additionalData = additionalData;
    }
}