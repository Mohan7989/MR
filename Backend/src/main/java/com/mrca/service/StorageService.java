package src.main.java.com.mrca.service;


import org.apache.commons.io.FilenameUtils;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

@Service
public class StorageService {
  @Value("${storage.root}")
  private String storageRoot;

  private final Tika tika = new Tika();

  public String saveTemp(MultipartFile file) throws IOException {
    ensureRoot();
    String ext = FilenameUtils.getExtension(file.getOriginalFilename());
    String name = "tmp_" + UUID.randomUUID() + (ext.isEmpty() ? "" : ("." + ext.toLowerCase()));
    File dest = new File(storageRoot, name);
    file.transferTo(dest);
    return dest.getAbsolutePath();
  }

  public String moveToPermanent(String tempPath) throws IOException {
    ensureRoot();
    File src = new File(tempPath);
    String ext = FilenameUtils.getExtension(src.getName());
    String name = "material_" + UUID.randomUUID() + (ext.isEmpty() ? "" : ("." + ext));
    File dest = new File(storageRoot, name);
    Files.move(src.toPath(), dest.toPath());
    return dest.getAbsolutePath();
  }

  public boolean isAllowed(File f) throws IOException {
    String mime = tika.detect(f);
    return mime.equals("application/pdf") || mime.startsWith("image/");
  }

  private void ensureRoot() {
    File root = new File(storageRoot);
    if (!root.exists()) root.mkdirs();
  }
}
