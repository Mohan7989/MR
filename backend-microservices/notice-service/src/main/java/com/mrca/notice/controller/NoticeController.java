package com.mrca.notice.controller;

import com.mrca.notice.model.Notice;
import com.mrca.notice.model.Update;
import com.mrca.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NoticeController {
    
    private final NoticeService noticeService;
    
    // ========== NOTICES ==========
    
    @GetMapping("/public/active")
    public ResponseEntity<List<Notice>> getActiveNotices() {
        List<Notice> notices = noticeService.getActiveNotices();
        return ResponseEntity.ok(notices);
    }
    
    @GetMapping("/public/recent")
    public ResponseEntity<List<Notice>> getRecentNotices(@RequestParam(defaultValue = "5") int limit) {
        List<Notice> notices = noticeService.getRecentNotices(limit);
        return ResponseEntity.ok(notices);
    }
    
    // ========== UPDATES ==========
    
    @GetMapping("/public/updates/active")
    public ResponseEntity<List<Update>> getActiveUpdates() {
        List<Update> updates = noticeService.getActiveUpdates();
        return ResponseEntity.ok(updates);
    }
    
    // ========== ADMIN ENDPOINTS ==========
    
    @GetMapping("/admin/all")
    public ResponseEntity<List<Notice>> getAllNotices() {
        List<Notice> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }
    
    @PostMapping("/admin")
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice savedNotice = noticeService.createNotice(notice);
        return ResponseEntity.ok(savedNotice);
    }
    
    @PutMapping("/admin/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Integer id, @RequestBody Notice notice) {
        Notice updatedNotice = noticeService.updateNotice(id, notice);
        return ResponseEntity.ok(updatedNotice);
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Integer id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/admin/{id}/toggle-active")
    public ResponseEntity<Notice> toggleNoticeActive(@PathVariable Integer id) {
        Notice notice = noticeService.toggleNoticeActive(id);
        return ResponseEntity.ok(notice);
    }
    
    // Updates admin endpoints
    @GetMapping("/admin/updates/all")
    public ResponseEntity<List<Update>> getAllUpdates() {
        List<Update> updates = noticeService.getAllUpdates();
        return ResponseEntity.ok(updates);
    }
    
    @PostMapping("/admin/updates")
    public ResponseEntity<Update> createUpdate(@RequestBody Update update) {
        Update savedUpdate = noticeService.createUpdate(update);
        return ResponseEntity.ok(savedUpdate);
    }
    
    @PutMapping("/admin/updates/{id}")
    public ResponseEntity<Update> updateUpdate(@PathVariable Integer id, @RequestBody Update update) {
        Update updatedUpdate = noticeService.updateUpdate(id, update);
        return ResponseEntity.ok(updatedUpdate);
    }
    
    @DeleteMapping("/admin/updates/{id}")
    public ResponseEntity<Void> deleteUpdate(@PathVariable Integer id) {
        noticeService.deleteUpdate(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/admin/updates/{id}/toggle-active")
    public ResponseEntity<Update> toggleUpdateActive(@PathVariable Integer id) {
        Update update = noticeService.toggleUpdateActive(id);
        return ResponseEntity.ok(update);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Notice Service is healthy");
    }
}