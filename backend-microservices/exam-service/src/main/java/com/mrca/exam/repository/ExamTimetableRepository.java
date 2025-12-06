package com.mrca.exam.repository;

import com.mrca.exam.model.ExamTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamTimetableRepository extends JpaRepository<ExamTimetable, Integer> {
    List<ExamTimetable> findByIsActiveTrueOrderByCreatedDateDesc();

    List<ExamTimetable> findAllByOrderByCreatedDateDesc();
}
