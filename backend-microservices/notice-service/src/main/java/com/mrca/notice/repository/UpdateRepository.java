package com.mrca.notice.repository;

import com.mrca.notice.model.Update;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpdateRepository extends JpaRepository<Update, Integer> {
    List<Update> findByIsActiveTrueOrderByCreatedDateDesc();

    List<Update> findAllByOrderByCreatedDateDesc();
}
