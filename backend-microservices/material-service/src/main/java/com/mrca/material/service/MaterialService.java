package com.mrca.material.service;

import com.mrca.material.model.Material;
import com.mrca.material.repository.MaterialRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    
    public List<Material> getAllApprovedMaterials() {
        return materialRepository.findByStatusOrderByCreatedDateDesc(Material.Status.APPROVED);
    }
    
    public List<Material> getFilteredMaterials(String semester, String group, String materialType, String year) {
        return materialRepository.findFilteredMaterials(semester, group, materialType, year);
    }
    
    public List<Material> searchMaterials(String query) {
        return materialRepository.searchMaterials(query);
    }
    
    public Material uploadMaterial(Material material) {
        // Set default status to PENDING
        material.setStatus(Material.Status.PENDING);
        material.setDownloads(0);
        return materialRepository.save(material);
    }
    
    @Transactional
    public Material incrementDownloadCount(Integer id) {
        Optional<Material> materialOpt = materialRepository.findById(id);
        if (materialOpt.isPresent()) {
            Material material = materialOpt.get();
            material.setDownloads(material.getDownloads() + 1);
            return materialRepository.save(material);
        }
        throw new RuntimeException("Material not found with id: " + id);
    }
    
    // Admin methods
    public List<Material> getPendingMaterials() {
        return materialRepository.findByStatusOrderByCreatedDateDesc(Material.Status.PENDING);
    }
    
    public List<Material> getApprovedMaterials() {
        return materialRepository.findByStatusOrderByCreatedDateDesc(Material.Status.APPROVED);
    }
    
    @Transactional
    public Material approveMaterial(Integer id) {
        Optional<Material> materialOpt = materialRepository.findById(id);
        if (materialOpt.isPresent()) {
            Material material = materialOpt.get();
            material.setStatus(Material.Status.APPROVED);
            return materialRepository.save(material);
        }
        throw new RuntimeException("Material not found with id: " + id);
    }
    
    @Transactional
    public void rejectMaterial(Integer id) {
        materialRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteMaterial(Integer id) {
        materialRepository.deleteById(id);
    }
}