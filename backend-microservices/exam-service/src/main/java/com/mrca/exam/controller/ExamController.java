package com.mrca.exam.controller;

import com.mrca.exam.model.ExamTimetable;
import com.mrca.exam.model.SliderImage;
import com.mrca.exam.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamController {
    
    private final ExamService examService;
    
    // ========== PUBLIC ENDPOINTS (Timetables) ==========
    
    @GetMapping("/public/timetables/active")
    public ResponseEntity<List<ExamTimetable>> getActiveTimetables() {
        List<ExamTimetable> timetables = examService.getActiveTimetables();
        return ResponseEntity.ok(timetables);
    }
    
    @GetMapping("/public/timetables/{id}")
    public ResponseEntity<ExamTimetable> getTimetableById(@PathVariable Integer id) {
        ExamTimetable timetable = examService.getTimetableById(id);
        return ResponseEntity.ok(timetable);
    }
    
    // ========== PUBLIC ENDPOINTS (Sliders) ==========
    
    @GetMapping("/public/sliders/active")
    public ResponseEntity<List<SliderImage>> getActiveSliders() {
        List<SliderImage> sliders = examService.getActiveSliders();
        return ResponseEntity.ok(sliders);
    }
    
    // ========== ADMIN ENDPOINTS (Timetables) ==========
    
    @GetMapping("/admin/timetables/all")
    public ResponseEntity<List<ExamTimetable>> getAllTimetables() {
        List<ExamTimetable> timetables = examService.getAllTimetables();
        return ResponseEntity.ok(timetables);
    }
    
    @PostMapping("/admin/timetables")
    public ResponseEntity<ExamTimetable> createTimetable(@RequestBody ExamTimetable timetable) {
        ExamTimetable savedTimetable = examService.createTimetable(timetable);
        return ResponseEntity.ok(savedTimetable);
    }
    
    @PutMapping("/admin/timetables/{id}")
    public ResponseEntity<ExamTimetable> updateTimetable(@PathVariable Integer id, 
                                                        @RequestBody ExamTimetable timetable) {
        ExamTimetable updatedTimetable = examService.updateTimetable(id, timetable);
        return ResponseEntity.ok(updatedTimetable);
    }
    
    @DeleteMapping("/admin/timetables/{id}")
    public ResponseEntity<Void> deleteTimetable(@PathVariable Integer id) {
        examService.deleteTimetable(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/admin/timetables/{id}/toggle-active")
    public ResponseEntity<ExamTimetable> toggleTimetableActive(@PathVariable Integer id) {
        ExamTimetable timetable = examService.toggleTimetableActive(id);
        return ResponseEntity.ok(timetable);
    }
    
    // ========== ADMIN ENDPOINTS (Sliders) ==========
    
    @GetMapping("/admin/sliders/all")
    public ResponseEntity<List<SliderImage>> getAllSliders() {
        List<SliderImage> sliders = examService.getAllSliders();
        return ResponseEntity.ok(sliders);
    }
    
    @PostMapping("/admin/sliders")
    public ResponseEntity<SliderImage> createSlider(@RequestBody SliderImage slider) {
        SliderImage savedSlider = examService.createSlider(slider);
        return ResponseEntity.ok(savedSlider);
    }
    
    @PutMapping("/admin/sliders/{id}")
    public ResponseEntity<SliderImage> updateSlider(@PathVariable Integer id, 
                                                   @RequestBody SliderImage slider) {
        SliderImage updatedSlider = examService.updateSlider(id, slider);
        return ResponseEntity.ok(updatedSlider);
    }
    
    @DeleteMapping("/admin/sliders/{id}")
    public ResponseEntity<Void> deleteSlider(@PathVariable Integer id) {
        examService.deleteSlider(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/admin/sliders/{id}/toggle-active")
    public ResponseEntity<SliderImage> toggleSliderActive(@PathVariable Integer id) {
        SliderImage slider = examService.toggleSliderActive(id);
        return ResponseEntity.ok(slider);
    }
    
    // ========== SETTINGS ENDPOINTS ==========
    
    @GetMapping("/public/settings/{key}")
    public ResponseEntity<Map<String, Object>> getSetting(@PathVariable String key) {
        Map<String, Object> setting = examService.getSetting(key);
        return ResponseEntity.ok(setting);
    }
    
    @GetMapping("/admin/settings/all")
    public ResponseEntity<List<Map<String, Object>>> getAllSettings() {
        List<Map<String, Object>> settings = examService.getAllSettings();
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/admin/settings/{key}")
    public ResponseEntity<Map<String, Object>> updateSetting(@PathVariable String key, 
                                                           @RequestBody Map<String, Object> settingData) {
        Map<String, Object> updatedSetting = examService.updateSetting(key, settingData);
        return ResponseEntity.ok(updatedSetting);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Exam Service is healthy");
    }
}