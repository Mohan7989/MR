package com.mrca.file.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;
    
    @Value("${aws.s3.bucket-name:}")
    private String bucketName;
    
    @Value("${aws.s3.region:}")
    private String region;
    
    @Value("${aws.s3.access-key:}")
    private String accessKey;
    
    @Value("${aws.s3.secret-key:}")
    private String secretKey;
    
    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;
    
    private Path fileStorageLocation;
    private S3Client s3Client;
    
    @PostConstruct
    public void init() {
        try {
            this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.fileStorageLocation);
            
            if (s3Enabled && !accessKey.isEmpty() && !secretKey.isEmpty()) {
                AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
                this.s3Client = S3Client.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                        .build();
                log.info("S3 client initialized for bucket: {}", bucketName);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }
    
    public String storeFile(MultipartFile file) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        
        if (originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // Generate unique filename
        String filename = UUID.randomUUID().toString() + fileExtension;
        
        if (s3Enabled) {
            return storeFileInS3(file, filename);
        } else {
            return storeFileLocally(file, filename);
        }
    }
    
    private String storeFileLocally(MultipartFile file, String filename) throws IOException {
        Path targetLocation = this.fileStorageLocation.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Return URL for local file
        return baseUrl + "/api/files/download/" + filename;
    }
    
    private String storeFileInS3(MultipartFile file, String filename) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();
            
            s3Client.putObject(putObjectRequest, 
                RequestBody.fromInputStream(inputStream, file.getSize()));
            
            // Return S3 URL
            return String.format("https://%s.s3.%s.amazonaws.com/%s", 
                    bucketName, region, filename);
        }
    }
    
    public Resource loadFileAsResource(String filename) throws IOException {
        if (s3Enabled) {
            throw new UnsupportedOperationException("Direct file download from S3 not implemented");
        }
        
        Path filePath = this.fileStorageLocation.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new IOException("File not found: " + filename);
        }
    }
    
    public boolean deleteFile(String filename) throws IOException {
        if (s3Enabled) {
            return deleteFileFromS3(filename);
        } else {
            return deleteFileLocally(filename);
        }
    }
    
    private boolean deleteFileLocally(String filename) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(filename).normalize();
        return Files.deleteIfExists(filePath);
    }
    
    private boolean deleteFileFromS3(String filename) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .build();
            
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", filename, e);
            return false;
        }
    }
}