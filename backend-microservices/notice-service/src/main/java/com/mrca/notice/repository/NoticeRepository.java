package com.mrca.notice.repository;

import com.mrca.notice.model.Notice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    List<Notice> findByIsActiveTrueOrderByCreatedDateDesc();

    List<Notice> findByIsActiveTrue(Pageable pageable);

    List<Notice> findAllByOrderByCreatedDateDesc();
}
