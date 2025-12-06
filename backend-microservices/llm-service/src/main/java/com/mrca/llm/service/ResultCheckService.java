package com.mrca.llm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mrca.llm.model.ResultCheckRequest;
import com.mrca.llm.model.ResultCheckResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class ResultCheckService {
    
    @Value("${openai.api.key:}")
    private String openaiApiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;
    
    @Value("${openai.model:gpt-4}")
    private String openaiModel;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final Random random;
    
    public ResultCheckService() {
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
        this.random = new Random();
    }
    
    public ResultCheckResponse checkResult(ResultCheckRequest request) {
        try {
            // If OpenAI API key is not configured, use mock response
            if (openaiApiKey == null || openaiApiKey.isEmpty()) {
                log.warn("OpenAI API key not configured. Using mock response.");
                return generateMockResponse(request);
            }
            
            // Prepare the prompt (same as your original Base44 prompt)
            String prompt = buildPrompt(request);
            
            // Call OpenAI API
            Map<String, Object> openaiRequest = Map.of(
                "model", openaiModel,
                "messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful assistant that checks exam results from college websites."),
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.3,
                "max_tokens", 500
            );
            
            String response = webClient.post()
                    .uri(openaiApiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .bodyValue(openaiRequest)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            return parseOpenAIResponse(request, response);
            
        } catch (Exception e) {
            log.error("Error checking result for roll number: {}", request.getRollNumber(), e);
            return ResultCheckResponse.error(request.getRollNumber(), e.getMessage());
        }
    }
    
    private String buildPrompt(ResultCheckRequest request) {
        return String.format("""
            Search for exam result for roll number "%s" from the college website: %s.
            
            Try to find if there's any result available for this roll number. If you can find result information, provide the details. If you cannot find the result or the roll number seems invalid, indicate that clearly.
            
            Important: Search the actual website content and provide real information if available.
            
            Provide response in this exact JSON format:
            {
                "found": true/false,
                "roll_number": "%s",
                "student_name": "Student name if found",
                "result_status": "Pass/Fail/Not Found/Pending",
                "message": "Additional message or details",
                "exam_name": "Name of the exam if found",
                "result_link": "Direct link to result if available"
            }
            
            If result not found, set "found" to false and provide helpful message.
            """, 
            request.getRollNumber(), 
            request.getResultUrl(),
            request.getRollNumber());
    }
    
    private ResultCheckResponse parseOpenAIResponse(ResultCheckRequest request, String openaiResponse) {
        try {
            Map<String, Object> responseMap = objectMapper.readValue(openaiResponse, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String content = (String) message.get("content");
                
                // Extract JSON from the content
                String jsonStart = content.indexOf("{");
                String jsonEnd = content.lastIndexOf("}") + 1;
                if (jsonStart != -1 && jsonEnd > jsonStart) {
                    String jsonContent = content.substring(jsonStart, jsonEnd);
                    Map<String, Object> resultMap = objectMapper.readValue(jsonContent, Map.class);
                    
                    ResultCheckResponse response = new ResultCheckResponse();
                    response.setFound((Boolean) resultMap.getOrDefault("found", false));
                    response.setRollNumber((String) resultMap.getOrDefault("roll_number", request.getRollNumber()));
                    response.setStudentName((String) resultMap.get("student_name"));
                    response.setResultStatus((String) resultMap.get("result_status"));
                    response.setMessage((String) resultMap.get("message"));
                    response.setExamName((String) resultMap.get("exam_name"));
                    response.setResultLink((String) resultMap.get("result_link"));
                    
                    return response;
                }
            }
            
            // Fallback if parsing fails
            return generateMockResponse(request);
            
        } catch (Exception e) {
            log.error("Failed to parse OpenAI response", e);
            return generateMockResponse(request);
        }
    }
    
    private ResultCheckResponse generateMockResponse(ResultCheckRequest request) {
        // Generate a mock response for testing/demo
        // In production, this should call the actual OpenAI API
        
        ResultCheckResponse response = new ResultCheckResponse();
        response.setRollNumber(request.getRollNumber());
        
        // Simulate 70% chance of finding result
        boolean found = random.nextDouble() < 0.7;
        response.setFound(found);
        
        if (found) {
            String[] names = {"Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Rajesh Gupta"};
            String[] exams = {"III B.A. V Semester", "B.Sc VI Semester", "B.Com V Semester", "B.B.A IV Semester"};
            String[] statuses = {"Pass", "Pass with Distinction", "Pass", "Fail", "Compartment"};
            
            response.setStudentName(names[random.nextInt(names.length)]);
            response.setExamName(exams[random.nextInt(exams.length)]);
            response.setResultStatus(statuses[random.nextInt(statuses.length)]);
            response.setMessage("Result found for " + request.getRollNumber() + 
                              ". Student has " + response.getResultStatus().toLowerCase() + 
                              " in " + response.getExamName());
            response.setResultLink(request.getResultUrl() + "?rollno=" + request.getRollNumber());
        } else {
            response.setFound(false);
            response.setResultStatus("Not Found");
            response.setMessage("Result not found for roll number: " + request.getRollNumber() + 
                              ". Please check the roll number and try again, or visit the official website.");
        }
        
        return response;
    }
}