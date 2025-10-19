package com.mrca.hub.controller;

import com.mrca.hub.model.Material;
import com.mrca.hub.model.UploadRequest;
import com.mrca.hub.service.MaterialService;
import com.mrca.hub.service.UploadService;
import com.mrca.hub.util.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UploadService uploadService;
    private final MaterialService materialService;
    private final FileStorageService storage;

    public AdminController(UploadService uploadService, MaterialService materialService, FileStorageService storage) {
        this.uploadService = uploadService; this.materialService = materialService; this.storage = storage;
    }

    @GetMapping("/uploads")
    public List<UploadRequest> pending(Authentication auth) {
        return uploadService.pending();
    }

    @PostMapping("/uploads/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) throws Exception {
        var u = uploadService.byId(id).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();
        if (!"PENDING".equals(u.getStatus())) return ResponseEntity.badRequest().body("Already processed");
        String publicUrl = storage.publish(u.getTempPath());

        Material m = new Material();
        m.setTitle(u.getTitle());
        m.setSubject(u.getSubject());
        m.setGroupName(u.getGroupName());
        m.setYear(u.getYear());
        m.setSemester(u.getSemester());
        m.setType(u.getType());
        m.setFileUrl(publicUrl);
        m.setFileType(u.getMimeType().contains("pdf") ? "pdf" : "image");
        materialService.save(m);

        u.setStatus("APPROVED");
        uploadService.save(u);

        return ResponseEntity.ok(m);
    }

    @PostMapping("/uploads/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        var u = uploadService.byId(id).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();
        if (!"PENDING".equals(u.getStatus())) return ResponseEntity.badRequest().body("Already processed");
        u.setStatus("REJECTED");
        uploadService.save(u);
        return ResponseEntity.ok().build();
    }
}