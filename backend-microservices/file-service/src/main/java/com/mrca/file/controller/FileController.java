package com.mrca.file.controller;

import com.mrca.file.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileController {
    
    private final FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.storeFile(file);
            return ResponseEntity.ok(Map.of("file_url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
    
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(filename);
            
            String contentType = Files.probeContentType(Path.of(filename));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/public/view/{filename:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(filename);
            
            String contentType = Files.probeContentType(Path.of(filename));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/admin/{filename:.+}")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String filename) {
        try {
            boolean deleted = fileStorageService.deleteFile(filename);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File not found"));
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to delete file: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("File Service is healthy");
    }
}