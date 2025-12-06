package com.mrca.auth.controller;

import com.mrca.auth.model.User;
import com.mrca.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Map<String, Object> response = authService.login(username, password);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = authService.validateToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = authService.logout(token.replace("Bearer ", ""));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is healthy");
    }
}