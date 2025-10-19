package src.main.java.com.mrca.controller;


import com.mrca.model.Material;
import com.mrca.model.UploadRequest;
import com.mrca.repo.MaterialRepo;
import com.mrca.repo.UploadRepo;
import com.mrca.service.StorageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  @Value("${app.admin.password}")
  private String adminPassword;

  private final UploadRepo uploadRepo;
  private final MaterialRepo materialRepo;
  private final StorageService storageService;

  public AdminController(UploadRepo u, MaterialRepo m, StorageService s){
    this.uploadRepo = u; this.materialRepo = m; this.storageService = s;
  }

  @PostMapping("/login")
  public Map<String,String> login(@RequestParam String password, HttpSession session){
    if (password != null && password.equals(adminPassword)) {
      session.setAttribute("admin", true);
      return Map.of("status","ok");
    }
    return Map.of("status","error","message","Invalid password");
  }

  @GetMapping("/uploads")
  public List<UploadRequest> listPending(HttpSession session){
    requireAdmin(session);
    return uploadRepo.findByApprovedFalseAndRejectedFalse();
  }

  @PostMapping("/approve/{id}")
  public Map<String,String> approve(@PathVariable Long id, HttpSession session) throws IOException {
    requireAdmin(session);
    UploadRequest ur = uploadRepo.findById(id).orElse(null);
    if (ur == null) return Map.of("status","error","message","Not found");
    String finalPath = storageService.moveToPermanent(ur.getTempFilePath());

    Material mat = new Material();
    mat.setTitle(ur.getTitle());
    mat.setSubject(ur.getSubject());
    mat.setGroupName(ur.getGroupName());
    mat.setSemester(ur.getSemester());
    mat.setYear(ur.getYear());
    mat.setType(ur.getType());
    mat.setFilePath(finalPath);
    mat.setPreviewUrl(finalPath);
    mat.setApproved(true);
    materialRepo.save(mat);

    ur.setApproved(true);
    uploadRepo.save(ur);
    return Map.of("status","ok");
  }

  @PostMapping("/approve-bulk")
  public Map<String,String> approveBulk(@RequestBody List<Long> ids, HttpSession session) throws IOException {
    requireAdmin(session);
    for (Long id : ids) {
      UploadRequest ur = uploadRepo.findById(id).orElse(null);
      if (ur != null && !ur.isApproved() && !ur.isRejected()) {
        String finalPath = storageService.moveToPermanent(ur.getTempFilePath());
        Material mat = new Material();
        mat.setTitle(ur.getTitle());
        mat.setSubject(ur.getSubject());
        mat.setGroupName(ur.getGroupName());
        mat.setSemester(ur.getSemester());
        mat.setYear(ur.getYear());
        mat.setType(ur.getType());
        mat.setFilePath(finalPath);
        mat.setPreviewUrl(finalPath);
        mat.setApproved(true);
        materialRepo.save(mat);
        ur.setApproved(true);
        uploadRepo.save(ur);
      }
    }
    return Map.of("status","ok");
  }

  @PostMapping("/reject/{id}")
  public Map<String,String> reject(@PathVariable Long id, HttpSession session){
    requireAdmin(session);
    UploadRequest ur = uploadRepo.findById(id).orElse(null);
    if (ur == null) return Map.of("status","error","message","Not found");
    ur.setRejected(true);
    uploadRepo.save(ur);
    return Map.of("status","ok");
  }

  private void requireAdmin(HttpSession session){
    Object ok = session.getAttribute("admin");
    if (!(ok instanceof Boolean) || !((Boolean) ok)) throw new RuntimeException("Unauthorized");
  }
}