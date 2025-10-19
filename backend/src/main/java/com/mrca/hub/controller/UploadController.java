package com.mrca.hub.controller;

import com.mrca.hub.model.UploadRequest;
import com.mrca.hub.service.UploadService;
import com.mrca.hub.util.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final UploadService service;
    private final FileStorageService storage;

    public UploadController(UploadService service, FileStorageService storage) {
        this.service = service; this.storage = storage;
    }

    @PostMapping
    public UploadRequest upload(
        @RequestParam String title,
        @RequestParam String subject,
        @RequestParam(name="group") String groupName,
        @RequestParam String year,
        @RequestParam String semester,
        @RequestParam String type,
        @RequestParam MultipartFile file
    ) throws Exception {
        var stored = storage.saveTemp(file);
        UploadRequest u = new UploadRequest();
        u.setTitle(title);
        u.setSubject(subject);
        u.setGroupName(groupName);
        u.setYear(year);
        u.setSemester(semester);
        u.setType(type);
        u.setTempPath(stored.path());
        u.setOriginalFilename(stored.originalName());
        u.setMimeType(stored.mimeType());
        u.setSize(stored.size());
        u.setStatus("PENDING");
        return service.save(u);
    }
}