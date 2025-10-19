package src.main.java.com.mrca.controller;



import com.mrca.dto.MaterialDTO;
import com.mrca.model.*;
import com.mrca.repo.*;
import com.mrca.service.StorageService;
import com.mrca.util.SlugUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotBlank;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PublicController {

  private final MaterialRepo materialRepo;
  private final UploadRepo uploadRepo;
  private final InternshipRepo internshipRepo;
  private final UpdateRepo updateRepo;
  private final NoticeRepo noticeRepo;
  private final TimetableRepo timetableRepo;
  private final StorageService storageService;

  @Value("${storage.root}")
  private String storageRoot;

  public PublicController(MaterialRepo m, UploadRepo u, InternshipRepo i, UpdateRepo up, NoticeRepo n, TimetableRepo t, StorageService s){
    this.materialRepo = m; this.uploadRepo = u; this.internshipRepo = i;
    this.updateRepo = up; this.noticeRepo = n; this.timetableRepo = t; this.storageService = s;
  }

  // Materials list with filters & pagination
  @GetMapping("/materials")
  public Map<String,Object> listMaterials(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String semester,
      @RequestParam(required = false) String group,
      @RequestParam(required = false) String subject,
      @RequestParam(required = false) String year,
      @RequestParam(required = false) String type
  ) {
    PageRequest pr = PageRequest.of(page, Math.max(1, Math.min(size, 20)));
    Page<Material> res;

    MaterialType mt = null;
    if (StringUtils.hasText(type)) {
      try { mt = MaterialType.valueOf(type); } catch (Exception ignored) {}
    }

    if (mt != null && StringUtils.hasText(subject) && StringUtils.hasText(year) && StringUtils.hasText(group)) {
      res = materialRepo.findByApprovedTrueAndTypeAndSubjectIgnoreCaseAndYearAndGroupNameIgnoreCase(mt, subject, year, group, pr);
    } else if (mt != null) {
      res = materialRepo.findByApprovedTrueAndType(mt, pr);
    } else if (StringUtils.hasText(subject)) {
      res = materialRepo.findByApprovedTrueAndSubjectIgnoreCase(subject, pr);
    } else if (StringUtils.hasText(year)) {
      res = materialRepo.findByApprovedTrueAndYear(year, pr);
    } else if (StringUtils.hasText(group)) {
      res = materialRepo.findByApprovedTrueAndGroupNameIgnoreCase(group, pr);
    } else {
      res = materialRepo.findByApprovedTrue(pr);
    }

    List<MaterialDTO> items = res.getContent().stream().map(this::toDTO).collect(Collectors.toList());
    Map<String,Object> out = new HashMap<>();
    out.put("items", items);
    out.put("page", res.getNumber());
    out.put("totalPages", res.getTotalPages());
    out.put("totalItems", res.getTotalElements());
    return out;
  }

  private MaterialDTO toDTO(Material m){
    MaterialDTO d = new MaterialDTO();
    d.id = m.getId();
    d.title = m.getTitle();
    d.subject = m.getSubject();
    d.groupName = m.getGroupName();
    d.semester = m.getSemester();
    d.year = m.getYear();
    d.type = m.getType();
    String fileName = new File(m.getFilePath()).getName();
    d.previewUrl = "/api/files/" + fileName;
    d.downloadUrl = "/api/files/" + fileName + "?download=true";
    d.slug = "/materials/" + SlugUtil.slugify(m.getTitle());
    return d;
  }

  // Search suggestions
  @GetMapping("/search")
  public List<MaterialDTO> search(@RequestParam("q") String q){
    if (!StringUtils.hasText(q)) return Collections.emptyList();
    return materialRepo.findTop10ByApprovedTrueAndTitleContainingIgnoreCaseOrSubjectContainingIgnoreCase(q, q)
        .stream().map(this::toDTO).collect(Collectors.toList());
  }

  // Updates ticker
  @GetMapping("/updates")
  public List<UpdateItem> updates(){ return updateRepo.findAll(); }

  // Notice single (latest)
  @GetMapping("/notice")
  public Notice notice(){ return noticeRepo.findAll().stream().findFirst().orElse(null); }

  // Timetables per rotation group (frontend rotates every 10s)
  @GetMapping("/timetable/{group}")
  public List<TimetableEntry> timetable(@PathVariable int group){ return timetableRepo.findByRotationGroupOrderByIdAsc(group); }

  // Internships list
  @GetMapping("/internships")
  public List<Internship> internships(){ return internshipRepo.findAll(); }

  // Upload with simple math captcha
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Map<String,String> upload(
      @RequestParam @NotBlank String title,
      @RequestParam @NotBlank String subject,
      @RequestParam String groupName,
      @RequestParam String semester,
      @RequestParam String year,
      @RequestParam String type,
      @RequestParam MultipartFile file,
      @RequestParam int captchaA,
      @RequestParam int captchaB,
      @RequestParam int captchaAnswer,
      @RequestParam boolean copyrightConfirmed
  ) throws IOException {
    if (captchaA + captchaB != captchaAnswer) {
      return Map.of("status", "error", "message", "Captcha failed");
    }
    MaterialType mt;
    try { mt = MaterialType.valueOf(type); } catch (Exception e){ return Map.of("status","error","message","Invalid type"); }

    String tempPath = storageService.saveTemp(file);
    File f = new File(tempPath);
    if (!storageService.isAllowed(f)) {
      f.delete();
      return Map.of("status","error","message","Only PDF or images allowed");
    }

    UploadRequest ur = new UploadRequest();
    ur.setTitle(title);
    ur.setSubject(subject);
    ur.setGroupName(groupName);
    ur.setSemester(semester);
    ur.setYear(year);
    ur.setType(mt);
    ur.setTempFilePath(tempPath);
    ur.setCopyrightConfirmed(copyrightConfirmed);
    uploadRepo.save(ur);

    return Map.of("status","ok","message","Upload completed. Within 2 hours your materials will go live.");
  }

  // Serve files (preview or download)
  @GetMapping("/files/{name}")
  public void file(@PathVariable String name, @RequestParam(required=false) Boolean download, HttpServletResponse resp) throws IOException {
    File f = new File(storageRoot, name);
    if (!f.exists()) { resp.sendError(404); return; }
    String mime = new org.apache.tika.Tika().detect(f);
    if (Boolean.TRUE.equals(download)) {
      resp.setHeader("Content-Disposition", "attachment; filename=\"" + name + "\"");
    }
    resp.setContentType(mime);
    try (FileInputStream in = new FileInputStream(f)) {
      IOUtils.copy(in, resp.getOutputStream());
    }
  }
}