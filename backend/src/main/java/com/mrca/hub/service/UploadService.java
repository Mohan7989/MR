package com.mrca.hub.service;

import com.mrca.hub.model.UploadRequest;
import com.mrca.hub.repo.UploadRequestRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UploadService {
    private final UploadRequestRepository repo;
    public UploadService(UploadRequestRepository repo) { this.repo = repo; }

    public UploadRequest save(UploadRequest u) { return repo.save(u); }
    public List<UploadRequest> pending() { return repo.findByStatus("PENDING"); }
    public Optional<UploadRequest> byId(Long id) { return repo.findById(id); }
}