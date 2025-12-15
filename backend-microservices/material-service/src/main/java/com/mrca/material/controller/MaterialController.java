package com.mrca.material.controller;

import com.mrca.material.model.Material;
import com.mrca.material.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaterialController {

    private final MaterialService materialService;

    // ========== PUBLIC ENDPOINTS ==========

    @GetMapping("/public/all")
    public ResponseEntity<List<Material>> getAllApprovedMaterials() {
        List<Material> materials = materialService.getAllApprovedMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/public/filter")
    public ResponseEntity<List<Material>> getFilteredMaterials(
            @RequestParam(defaultValue = "All") String semester,
            @RequestParam(defaultValue = "All") String group,
            @RequestParam(defaultValue = "All") String materialType,
            @RequestParam(defaultValue = "All") String year) {

        List<Material> materials = materialService.getFilteredMaterials(semester, group, materialType, year);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Material>> searchMaterials(@RequestParam String query) {
        List<Material> materials = materialService.searchMaterials(query);
        return ResponseEntity.ok(materials);
    }

    @PostMapping("/upload")
    public ResponseEntity<Material> uploadMaterial(@RequestBody Material material) {
        Material savedMaterial = materialService.uploadMaterial(material);
        return ResponseEntity.ok(savedMaterial);
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<Material> incrementDownload(@PathVariable Integer id) {
        Material material = materialService.incrementDownloadCount(id);
        return ResponseEntity.ok(material);
    }

    // ========== ADMIN ENDPOINTS ==========

    @GetMapping("/admin/pending")
    public ResponseEntity<List<Material>> getPendingMaterials() {
        List<Material> materials = materialService.getPendingMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/admin/approved")
    public ResponseEntity<List<Material>> getApprovedMaterials() {
        List<Material> materials = materialService.getApprovedMaterials();
        return ResponseEntity.ok(materials);
    }

    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<Material> approveMaterial(@PathVariable Integer id) {
        Material material = materialService.approveMaterial(id);
        return ResponseEntity.ok(material);
    }

    @DeleteMapping("/admin/{id}/reject")
    public ResponseEntity<Void> rejectMaterial(@PathVariable Integer id) {
        materialService.rejectMaterial(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Integer id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Material Service is healthy");
    }
}