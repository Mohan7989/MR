package com.mrca.hub.repo;

import com.mrca.hub.model.UploadRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UploadRequestRepository extends JpaRepository<UploadRequest, Long> {
    List<UploadRequest> findByStatus(String status);
}
