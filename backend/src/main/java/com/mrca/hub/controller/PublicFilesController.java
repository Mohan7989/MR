package com.mrca.hub.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;

@RestController
@RequestMapping("/files/public")
public class PublicFilesController {
    @Value("${storage.root}")
    private String storageRoot;

    @GetMapping("/{filename}")
    public ResponseEntity<FileSystemResource> serve(@PathVariable String filename) {
        Path p = Path.of(storageRoot, "public", filename);
        FileSystemResource res = new FileSystemResource(p.toFile());
        if (!res.exists()) return ResponseEntity.notFound().build();
        MediaType mt = filename.toLowerCase().endsWith(".pdf") ? MediaType.APPLICATION_PDF : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok().contentType(mt).body(res);
    }
}