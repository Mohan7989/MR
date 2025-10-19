package com.mrca.hub.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${storage.root}")
    private String storageRoot;

    private final Tika tika = new Tika();

    public StoredFile saveTemp(MultipartFile file) throws IOException {
        String uuid = UUID.randomUUID().toString();
        String dir = storageRoot + "/temp/";
        Files.createDirectories(Paths.get(dir));
        String path = dir + uuid + "-" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, Paths.get(path), StandardCopyOption.REPLACE_EXISTING);
        }
        String mime = tika.detect(Paths.get(path));
        return new StoredFile(path, file.getOriginalFilename(), mime, file.getSize());
    }

    public String publish(String tempPath) throws IOException {
        String dir = storageRoot + "/public/";
        Files.createDirectories(Paths.get(dir));
        Path source = Paths.get(tempPath);
        String filename = source.getFileName().toString();
        Path target = Paths.get(dir + filename);
        Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
        // For Render static serve, we’ll expose /files/public via a simple controller or static mapping
        return "/files/public/" + filename;
    }

    public record StoredFile(String path, String originalName, String mimeType, long size) {}
}