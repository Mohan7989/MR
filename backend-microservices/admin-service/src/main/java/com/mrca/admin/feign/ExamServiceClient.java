package com.mrca.admin.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "exam-service")
public interface ExamServiceClient {
    
    // Timetables
    @GetMapping("/api/exams/admin/timetables/all")
    List<Map<String, Object>> getAllTimetables();
    
    @PostMapping("/api/exams/admin/timetables")
    Map<String, Object> createTimetable(@RequestBody Map<String, Object> timetable);
    
    @PutMapping("/api/exams/admin/timetables/{id}")
    Map<String, Object> updateTimetable(@PathVariable Integer id, @RequestBody Map<String, Object> timetable);
    
    @DeleteMapping("/api/exams/admin/timetables/{id}")
    void deleteTimetable(@PathVariable Integer id);
    
    @PutMapping("/api/exams/admin/timetables/{id}/toggle-active")
    Map<String, Object> toggleTimetableActive(@PathVariable Integer id);
    
    // Sliders
    @GetMapping("/api/exams/admin/sliders/all")
    List<Map<String, Object>> getAllSliders();
    
    @PostMapping("/api/exams/admin/sliders")
    Map<String, Object> createSlider(@RequestBody Map<String, Object> slider);
    
    @PutMapping("/api/exams/admin/sliders/{id}")
    Map<String, Object> updateSlider(@PathVariable Integer id, @RequestBody Map<String, Object> slider);
    
    @DeleteMapping("/api/exams/admin/sliders/{id}")
    void deleteSlider(@PathVariable Integer id);
    
    @PutMapping("/api/exams/admin/sliders/{id}/toggle-active")
    Map<String, Object> toggleSliderActive(@PathVariable Integer id);
    
    // Settings
    @GetMapping("/api/exams/admin/settings/all")
    List<Map<String, Object>> getAllSettings();
    
    @PutMapping("/api/exams/admin/settings/{key}")
    Map<String, Object> updateSetting(@PathVariable String key, @RequestBody Map<String, Object> setting);
}