package com.mrca.admin.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "material-service")
public interface MaterialServiceClient {
    
    @GetMapping("/api/materials/admin/pending")
    List<Map<String, Object>> getPendingMaterials();
    
    @GetMapping("/api/materials/admin/approved")
    List<Map<String, Object>> getApprovedMaterials();
    
    @PutMapping("/api/materials/admin/{id}/approve")
    Map<String, Object> approveMaterial(@PathVariable Integer id);
    
    @DeleteMapping("/api/materials/admin/{id}/reject")
    void rejectMaterial(@PathVariable Integer id);
    
    @DeleteMapping("/api/materials/admin/{id}")
    void deleteMaterial(@PathVariable Integer id);
}