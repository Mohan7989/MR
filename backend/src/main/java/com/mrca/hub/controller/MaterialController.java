package com.mrca.hub.controller;

import com.mrca.hub.model.Material;
import com.mrca.hub.service.MaterialService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {
    private final MaterialService service;
    public MaterialController(MaterialService service) { this.service = service; }

    @GetMapping
    public List<Material> list(
        @RequestParam(required = false) String semester,
        @RequestParam(required = false, name="group") String groupName,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String year,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String q
    ) {
        return service.filter(semester, groupName, subject, year, type, q);
    }

    @GetMapping("/updates")
    public List<String> updates() {
        return List.of(
            "Internship opportunities available for students",
            "Semester results released",
            "Upcoming events and workshops",
            "Semester notes regarding exam dates"
        );
    }
}