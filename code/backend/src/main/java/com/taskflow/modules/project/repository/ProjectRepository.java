package com.taskflow.modules.project.repository;

import com.taskflow.modules.project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    List<ProjectEntity> findByWorkspaceIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID workspaceId);

    List<ProjectEntity> findByWorkspaceIdAndIsFavoriteTrueAndIsDeletedFalse(UUID workspaceId);

    List<ProjectEntity> findByWorkspaceIdAndIsArchivedTrueAndIsDeletedFalse(UUID workspaceId);

    Optional<ProjectEntity> findByIdAndIsDeletedFalse(UUID id);
}
