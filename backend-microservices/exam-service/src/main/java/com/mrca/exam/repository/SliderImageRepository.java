package com.mrca.exam.repository;

import com.mrca.exam.model.SliderImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SliderImageRepository extends JpaRepository<SliderImage, Integer> {
    List<SliderImage> findByIsActiveTrueOrderByOrderAsc();

    List<SliderImage> findAllByOrderByOrderAsc();
}
