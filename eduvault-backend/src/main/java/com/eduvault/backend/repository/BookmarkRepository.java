package com.eduvault.backend.repository;

import com.eduvault.backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByStudentId(String studentId);

    Optional<Bookmark> findByStudentIdAndResourceId(String studentId, String resourceId);

    boolean existsByStudentIdAndResourceId(String studentId, String resourceId);

    long countByStudentId(String studentId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Bookmark b WHERE b.student.id = :studentId AND b.resource.id = :resourceId")
    void deleteByStudentIdAndResourceId(@Param("studentId") String studentId,
                                        @Param("resourceId") String resourceId);
}
