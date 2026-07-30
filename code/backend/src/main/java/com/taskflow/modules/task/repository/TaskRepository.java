package com.taskflow.modules.task.repository;

import com.taskflow.modules.task.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {

    List<TaskEntity> findByProjectIdAndIsDeletedFalseOrderByPositionAsc(UUID projectId);

    Optional<TaskEntity> findByIdAndIsDeletedFalse(UUID id);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectId = :projectId AND t.isDeleted = false " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:archived IS NULL OR t.isArchived = :archived) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.position ASC")
    List<TaskEntity> searchTasks(
            @Param("projectId") UUID projectId,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("archived") Boolean archived,
            @Param("search") String search);

    @Query("SELECT COALESCE(MAX(t.position), 0.0) FROM TaskEntity t WHERE t.projectId = :projectId")
    Double findMaxPositionByProjectId(@Param("projectId") UUID projectId);
}
