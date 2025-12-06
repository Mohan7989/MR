package com.mrca.admin.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "notice-service")
public interface NoticeServiceClient {
    
    @GetMapping("/api/notices/admin/all")
    List<Map<String, Object>> getAllNotices();
    
    @PostMapping("/api/notices/admin")
    Map<String, Object> createNotice(@RequestBody Map<String, Object> notice);
    
    @PutMapping("/api/notices/admin/{id}")
    Map<String, Object> updateNotice(@PathVariable Integer id, @RequestBody Map<String, Object> notice);
    
    @DeleteMapping("/api/notices/admin/{id}")
    void deleteNotice(@PathVariable Integer id);
    
    @PutMapping("/api/notices/admin/{id}/toggle-active")
    Map<String, Object> toggleNoticeActive(@PathVariable Integer id);
    
    // Updates
    @GetMapping("/api/notices/admin/updates/all")
    List<Map<String, Object>> getAllUpdates();
    
    @PostMapping("/api/notices/admin/updates")
    Map<String, Object> createUpdate(@RequestBody Map<String, Object> update);
    
    @PutMapping("/api/notices/admin/updates/{id}")
    Map<String, Object> updateUpdate(@PathVariable Integer id, @RequestBody Map<String, Object> update);
    
    @DeleteMapping("/api/notices/admin/updates/{id}")
    void deleteUpdate(@PathVariable Integer id);
    
    @PutMapping("/api/notices/admin/updates/{id}/toggle-active")
    Map<String, Object> toggleUpdateActive(@PathVariable Integer id);
}