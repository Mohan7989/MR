package com.mrca.notice.service;

import com.mrca.notice.model.Notice;
import com.mrca.notice.model.Update;
import com.mrca.notice.repository.NoticeRepository;
import com.mrca.notice.repository.UpdateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticeService {
    
    private final NoticeRepository noticeRepository;
    private final UpdateRepository updateRepository;
    
    // Notice methods
    public List<Notice> getActiveNotices() {
        return noticeRepository.findByIsActiveTrueOrderByCreatedDateDesc();
    }
    
    public List<Notice> getRecentNotices(int limit) {
        return noticeRepository.findByIsActiveTrue(
            PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdDate"))
        );
    }
    
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedDateDesc();
    }
    
    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }
    
    @Transactional
    public Notice updateNotice(Integer id, Notice noticeDetails) {
        Optional<Notice> noticeOpt = noticeRepository.findById(id);
        if (noticeOpt.isPresent()) {
            Notice notice = noticeOpt.get();
            notice.setTitle(noticeDetails.getTitle());
            notice.setDescription(noticeDetails.getDescription());
            notice.setIsUrgent(noticeDetails.getIsUrgent());
            notice.setIsActive(noticeDetails.getIsActive());
            return noticeRepository.save(notice);
        }
        throw new RuntimeException("Notice not found with id: " + id);
    }
    
    @Transactional
    public void deleteNotice(Integer id) {
        noticeRepository.deleteById(id);
    }
    
    @Transactional
    public Notice toggleNoticeActive(Integer id) {
        Optional<Notice> noticeOpt = noticeRepository.findById(id);
        if (noticeOpt.isPresent()) {
            Notice notice = noticeOpt.get();
            notice.setIsActive(!notice.getIsActive());
            return noticeRepository.save(notice);
        }
        throw new RuntimeException("Notice not found with id: " + id);
    }
    
    // Update methods
    public List<Update> getActiveUpdates() {
        return updateRepository.findByIsActiveTrueOrderByCreatedDateDesc();
    }
    
    public List<Update> getAllUpdates() {
        return updateRepository.findAllByOrderByCreatedDateDesc();
    }
    
    public Update createUpdate(Update update) {
        return updateRepository.save(update);
    }
    
    @Transactional
    public Update updateUpdate(Integer id, Update updateDetails) {
        Optional<Update> updateOpt = updateRepository.findById(id);
        if (updateOpt.isPresent()) {
            Update update = updateOpt.get();
            update.setMessage(updateDetails.getMessage());
            update.setIsActive(updateDetails.getIsActive());
            return updateRepository.save(update);
        }
        throw new RuntimeException("Update not found with id: " + id);
    }
    
    @Transactional
    public void deleteUpdate(Integer id) {
        updateRepository.deleteById(id);
    }
    
    @Transactional
    public Update toggleUpdateActive(Integer id) {
        Optional<Update> updateOpt = updateRepository.findById(id);
        if (updateOpt.isPresent()) {
            Update update = updateOpt.get();
            update.setIsActive(!update.getIsActive());
            return updateRepository.save(update);
        }
        throw new RuntimeException("Update not found with id: " + id);
    }
}