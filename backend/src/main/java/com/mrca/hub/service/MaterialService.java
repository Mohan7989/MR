package com.mrca.hub.service;

import com.mrca.hub.model.Material;
import com.mrca.hub.repo.MaterialRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaterialService {
    private final MaterialRepository repo;
    public MaterialService(MaterialRepository repo) { this.repo = repo; }

    public List<Material> filter(String semester, String groupName, String subject, String year, String type, String q) {
        return repo.filter(semester, groupName, subject, year, type, q);
    }

    public Material save(Material m) { return repo.save(m); }
}