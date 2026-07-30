package com.taskflow.modules.project.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.project.dto.CreateProjectRequest;
import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.dto.ProjectStatsDto;
import com.taskflow.modules.project.dto.UpdateProjectRequest;
import com.taskflow.modules.project.entity.ProjectEntity;
import com.taskflow.modules.project.mapper.ProjectMapper;
import com.taskflow.modules.project.repository.ProjectRepository;
import com.taskflow.modules.project.service.ProjectService;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceService workspaceService;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            WorkspaceService workspaceService,
            ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.workspaceService = workspaceService;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional
    public ProjectDto createProject(UUID userId, UUID workspaceId, CreateProjectRequest request) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        ProjectEntity project = new ProjectEntity(
                request.getName().trim(),
                request.getDescription(),
                workspaceId,
                request.getColor(),
                request.getIcon()
        );

        ProjectEntity saved = projectRepository.save(project);
        return projectMapper.toDto(saved, calculateEmptyStats());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getWorkspaceProjects(UUID userId, UUID workspaceId, Boolean archived, Boolean favorite) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        List<ProjectEntity> projects;
        if (Boolean.TRUE.equals(favorite)) {
            projects = projectRepository.findByWorkspaceIdAndIsFavoriteTrueAndIsDeletedFalse(workspaceId);
        } else if (Boolean.TRUE.equals(archived)) {
            projects = projectRepository.findByWorkspaceIdAndIsArchivedTrueAndIsDeletedFalse(workspaceId);
        } else {
            projects = projectRepository.findByWorkspaceIdAndIsDeletedFalseOrderByCreatedAtDesc(workspaceId);
        }

        return projects.stream()
                .map(entity -> projectMapper.toDto(entity, calculateEmptyStats()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProjectDetails(UUID userId, UUID projectId) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        return projectMapper.toDto(project, calculateEmptyStats());
    }

    @Override
    @Transactional
    public ProjectDto updateProject(UUID userId, UUID projectId, UpdateProjectRequest request) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        project.setName(request.getName().trim());
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getColor() != null) {
            project.setColor(request.getColor());
        }
        if (request.getIcon() != null) {
            project.setIcon(request.getIcon());
        }

        ProjectEntity updated = projectRepository.save(project);
        return projectMapper.toDto(updated, calculateEmptyStats());
    }

    @Override
    @Transactional
    public void deleteProject(UUID userId, UUID projectId) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        project.setIsDeleted(true);
        project.setDeletedAt(Instant.now());
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public ProjectDto toggleArchiveProject(UUID userId, UUID projectId) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        project.setIsArchived(!project.getIsArchived());
        ProjectEntity updated = projectRepository.save(project);

        return projectMapper.toDto(updated, calculateEmptyStats());
    }

    @Override
    @Transactional
    public ProjectDto toggleFavoriteProject(UUID userId, UUID projectId) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        project.setIsFavorite(!project.getIsFavorite());
        ProjectEntity updated = projectRepository.save(project);

        return projectMapper.toDto(updated, calculateEmptyStats());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectStatsDto getProjectStats(UUID userId, UUID projectId) {
        ProjectEntity project = findActiveProjectById(projectId);
        workspaceService.getWorkspaceDetails(userId, project.getWorkspaceId());

        return calculateEmptyStats();
    }

    private ProjectEntity findActiveProjectById(UUID projectId) {
        return projectRepository.findByIdAndIsDeletedFalse(projectId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Project not found"));
    }

    private ProjectStatsDto calculateEmptyStats() {
        return new ProjectStatsDto(0, 0, 0, 0.0);
    }
}
