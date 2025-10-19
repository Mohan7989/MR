package src.main.java.com.mrca.repo;



import com.mrca.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepo extends JpaRepository<Material, Long> {
  Page<Material> findByApprovedTrue(Pageable pageable);
  Page<Material> findByApprovedTrueAndType(MaterialType type, Pageable pageable);
  Page<Material> findByApprovedTrueAndSubjectIgnoreCase(String subject, Pageable pageable);
  Page<Material> findByApprovedTrueAndYear(String year, Pageable pageable);
  Page<Material> findByApprovedTrueAndGroupNameIgnoreCase(String groupName, Pageable pageable);

  Page<Material> findByApprovedTrueAndTypeAndSubjectIgnoreCaseAndYearAndGroupNameIgnoreCase(
      MaterialType type, String subject, String year, String groupName, Pageable pageable);

  List<Material> findTop10ByApprovedTrueAndTitleContainingIgnoreCaseOrSubjectContainingIgnoreCase(String t1, String t2);
}

public interface UploadRepo extends JpaRepository<UploadRequest, Long> {
  List<UploadRequest> findByApprovedFalseAndRejectedFalse();
}

public interface InternshipRepo extends JpaRepository<Internship, Long> { }

public interface UpdateRepo extends JpaRepository<UpdateItem, Long> { }

public interface NoticeRepo extends JpaRepository<Notice, Long> { }

public interface TimetableRepo extends JpaRepository<TimetableEntry, Long> {
  List<TimetableEntry> findByRotationGroupOrderByIdAsc(int rotationGroup);
}