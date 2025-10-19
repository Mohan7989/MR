package com.mrca.hub.repo;

import com.mrca.hub.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    @Query("""
        SELECT m FROM Material m
        WHERE (:semester is null or :semester='All' or m.semester=:semester)
          AND (:groupName is null or :groupName='All' or m.groupName=:groupName)
          AND (:subject is null or :subject='All' or m.subject=:subject)
          AND (:year is null or :year='All' or m.year=:year)
          AND (:type is null or :type='All' or m.type=:type)
          AND (:q is null or LOWER(m.title) LIKE LOWER(CONCAT('%',:q,'%')))
        ORDER BY m.createdAt DESC
    """)
    List<Material> filter(String semester, String groupName, String subject, String year, String type, String q);
}