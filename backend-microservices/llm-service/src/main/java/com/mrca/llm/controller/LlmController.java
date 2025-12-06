package com.mrca.llm.controller;

import com.mrca.llm.model.ResultCheckRequest;
import com.mrca.llm.model.ResultCheckResponse;
import com.mrca.llm.service.ResultCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/llm")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LlmController {
    
    private final ResultCheckService resultCheckService;
    
    @PostMapping("/check-result")
    public ResponseEntity<ResultCheckResponse> checkResult(@RequestBody ResultCheckRequest request) {
        ResultCheckResponse response = resultCheckService.checkResult(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/check-result-simple")
    public ResponseEntity<ResultCheckResponse> checkResultSimple(@RequestBody Map<String, String> request) {
        ResultCheckRequest checkRequest = new ResultCheckRequest();
        checkRequest.setRollNumber(request.get("rollNumber"));
        checkRequest.setResultUrl(request.getOrDefault("resultUrl", 
                "https://mracollegevzm.com/exam-results/"));
        
        ResultCheckResponse response = resultCheckService.checkResult(checkRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        return ResponseEntity.ok(Map.of(
            "status", "LLM Service is running",
            "version", "1.0.0",
            "provider", "OpenAI GPT-4"
        ));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("LLM Service is healthy");
    }
}