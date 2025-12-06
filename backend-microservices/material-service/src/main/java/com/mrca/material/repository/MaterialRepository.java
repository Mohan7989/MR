package com.mrca.material.repository;

import com.mrca.material.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    
    List<Material> findByStatusOrderByCreatedDateDesc(Material.Status status);
    
    List<Material> findAllByOrderByCreatedDateDesc();
    
    @Query("SELECT m FROM Material m WHERE " +
           "(:semester = 'All' OR m.semester = :semester) AND " +
           "(:group = 'All' OR m.group = :group OR m.group = com.mrca.material.model.Material.Group.ALL) AND " +
           "(:materialType = 'All' OR m.materialType = :materialType) AND " +
           "(:year = 'All' OR m.year = :year) AND " +
           "m.status = 'APPROVED' " +
           "ORDER BY m.createdDate DESC")
    List<Material> findFilteredMaterials(
            @Param("semester") String semester,
            @Param("group") String group,
            @Param("materialType") String materialType,
            @Param("year") String year);
    
    @Query("SELECT m FROM Material m WHERE " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.subject) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "m.status = 'APPROVED' " +
           "ORDER BY m.createdDate DESC")
    List<Material> searchMaterials(@Param("query") String query);
}