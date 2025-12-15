package com.mrca.admin.controller;

import com.mrca.admin.feign.*;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private final MaterialServiceClient materialClient;

    private final NoticeServiceClient noticeClient;
    private final ExamServiceClient examClient;

    // ========== DASHBOARD STATS ==========

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            // Get counts from all services
            var pendingMaterials = materialClient.getPendingMaterials();
            var approvedMaterials = materialClient.getApprovedMaterials();
            var notices = noticeClient.getAllNotices();
            var updates = noticeClient.getAllUpdates();
            var timetables = examClient.getAllTimetables();
            var sliders = examClient.getAllSliders();

            Map<String, Object> stats = Map.of(
                    "pendingMaterials", pendingMaterials.size(),
                    "approvedMaterials", approvedMaterials.size(),
                    "totalMaterials", pendingMaterials.size() + approvedMaterials.size(),
                    "notices", notices.size(),
                    "updates", updates.size(),
                    "timetables", timetables.size(),
                    "sliders", sliders.size());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "pendingMaterials", 0,
                    "approvedMaterials", 0,
                    "totalMaterials", 0,
                    "notices", 0,
                    "updates", 0,
                    "timetables", 0,
                    "sliders", 0));
        }
    }

    // ========== MATERIALS PROXY ==========

    @GetMapping("/materials/pending")
    public ResponseEntity<?> getPendingMaterials() {
        return ResponseEntity.ok(materialClient.getPendingMaterials());
    }

    @GetMapping("/materials/approved")
    public ResponseEntity<?> getApprovedMaterials() {
        return ResponseEntity.ok(materialClient.getApprovedMaterials());
    }

    @PutMapping("/materials/{id}/approve")
    public ResponseEntity<?> approveMaterial(@PathVariable Integer id) {
        return ResponseEntity.ok(materialClient.approveMaterial(id));
    }

    @DeleteMapping("/materials/{id}/reject")
    public ResponseEntity<Void> rejectMaterial(@PathVariable Integer id) {
        materialClient.rejectMaterial(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Integer id) {
        materialClient.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    // ========== NOTICES PROXY ==========

    @GetMapping("/notices")
    public ResponseEntity<?> getAllNotices() {
        return ResponseEntity.ok(noticeClient.getAllNotices());
    }

    @PostMapping("/notices")
    public ResponseEntity<?> createNotice(@RequestBody Map<String, Object> notice) {
        return ResponseEntity.ok(noticeClient.createNotice(notice));
    }

    @PutMapping("/notices/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable Integer id, @RequestBody Map<String, Object> notice) {
        return ResponseEntity.ok(noticeClient.updateNotice(id, notice));
    }

    @DeleteMapping("/notices/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Integer id) {
        noticeClient.deleteNotice(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notices/{id}/toggle-active")
    public ResponseEntity<?> toggleNoticeActive(@PathVariable Integer id) {
        return ResponseEntity.ok(noticeClient.toggleNoticeActive(id));
    }

    // ========== UPDATES PROXY ==========

    @GetMapping("/updates")
    public ResponseEntity<?> getAllUpdates() {
        return ResponseEntity.ok(noticeClient.getAllUpdates());
    }

    @PostMapping("/updates")
    public ResponseEntity<?> createUpdate(@RequestBody Map<String, Object> update) {
        return ResponseEntity.ok(noticeClient.createUpdate(update));
    }

    @PutMapping("/updates/{id}")
    public ResponseEntity<?> updateUpdate(@PathVariable Integer id, @RequestBody Map<String, Object> update) {
        return ResponseEntity.ok(noticeClient.updateUpdate(id, update));
    }

    @DeleteMapping("/updates/{id}")
    public ResponseEntity<Void> deleteUpdate(@PathVariable Integer id) {
        noticeClient.deleteUpdate(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updates/{id}/toggle-active")
    public ResponseEntity<?> toggleUpdateActive(@PathVariable Integer id) {
        return ResponseEntity.ok(noticeClient.toggleUpdateActive(id));
    }

    // ========== TIMETABLES PROXY ==========

    @GetMapping("/timetables")
    public ResponseEntity<?> getAllTimetables() {
        return ResponseEntity.ok(examClient.getAllTimetables());
    }

    @PostMapping("/timetables")
    public ResponseEntity<?> createTimetable(@RequestBody Map<String, Object> timetable) {
        return ResponseEntity.ok(examClient.createTimetable(timetable));
    }

    @PutMapping("/timetables/{id}")
    public ResponseEntity<?> updateTimetable(@PathVariable Integer id, @RequestBody Map<String, Object> timetable) {
        return ResponseEntity.ok(examClient.updateTimetable(id, timetable));
    }

    @DeleteMapping("/timetables/{id}")
    public ResponseEntity<Void> deleteTimetable(@PathVariable Integer id) {
        examClient.deleteTimetable(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/timetables/{id}/toggle-active")
    public ResponseEntity<?> toggleTimetableActive(@PathVariable Integer id) {
        return ResponseEntity.ok(examClient.toggleTimetableActive(id));
    }

    // ========== SLIDERS PROXY ==========

    @GetMapping("/sliders")
    public ResponseEntity<?> getAllSliders() {
        return ResponseEntity.ok(examClient.getAllSliders());
    }

    @PostMapping("/sliders")
    public ResponseEntity<?> createSlider(@RequestBody Map<String, Object> slider) {
        return ResponseEntity.ok(examClient.createSlider(slider));
    }

    @PutMapping("/sliders/{id}")
    public ResponseEntity<?> updateSlider(@PathVariable Integer id, @RequestBody Map<String, Object> slider) {
        return ResponseEntity.ok(examClient.updateSlider(id, slider));
    }

    @DeleteMapping("/sliders/{id}")
    public ResponseEntity<Void> deleteSlider(@PathVariable Integer id) {
        examClient.deleteSlider(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/sliders/{id}/toggle-active")
    public ResponseEntity<?> toggleSliderActive(@PathVariable Integer id) {
        return ResponseEntity.ok(examClient.toggleSliderActive(id));
    }

    // ========== SETTINGS PROXY ==========

    @GetMapping("/settings")
    public ResponseEntity<?> getAllSettings() {
        return ResponseEntity.ok(examClient.getAllSettings());
    }

    @PutMapping("/settings/{key}")
    public ResponseEntity<?> updateSetting(@PathVariable String key, @RequestBody Map<String, Object> setting) {
        return ResponseEntity.ok(examClient.updateSetting(key, setting));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Admin Service is healthy");
    }
}