package com.taskflow.modules.workspace.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import com.taskflow.modules.workspace.dto.CreateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.UpdateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.dto.WorkspaceMemberDto;
import com.taskflow.modules.workspace.entity.WorkspaceEntity;
import com.taskflow.modules.workspace.entity.WorkspaceMemberEntity;
import com.taskflow.modules.workspace.mapper.WorkspaceMapper;
import com.taskflow.modules.workspace.repository.WorkspaceMemberRepository;
import com.taskflow.modules.workspace.repository.WorkspaceRepository;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserService userService;
    private final WorkspaceMapper workspaceMapper;

    public WorkspaceServiceImpl(
            WorkspaceRepository workspaceRepository,
            WorkspaceMemberRepository workspaceMemberRepository,
            UserService userService,
            WorkspaceMapper workspaceMapper) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.userService = userService;
        this.workspaceMapper = workspaceMapper;
    }

    @Override
    @Transactional
    public WorkspaceDto createWorkspace(UUID ownerId, CreateWorkspaceRequest request) {
        String slug = generateSlug(request.getName(), request.getSlug());

        if (workspaceRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        WorkspaceEntity workspace = new WorkspaceEntity();
        workspace.setName(request.getName().trim());
        workspace.setSlug(slug);
        workspace.setDescription(request.getDescription());
        workspace.setOwnerId(ownerId);
        workspace.setIconUrl(request.getIconUrl());
        if (request.getThemeColor() != null) {
            workspace.setThemeColor(request.getThemeColor());
        }

        WorkspaceEntity savedWorkspace = workspaceRepository.save(workspace);

        WorkspaceMemberEntity ownerMember = new WorkspaceMemberEntity(
                savedWorkspace.getId(),
                ownerId,
                "OWNER",
                "ACTIVE"
        );
        workspaceMemberRepository.save(ownerMember);

        return workspaceMapper.toDto(savedWorkspace, 1, "OWNER");
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceDto> getUserWorkspaces(UUID userId) {
        List<WorkspaceEntity> entities = workspaceRepository.findAllWorkspacesByUserId(userId);
        return entities.stream().map(entity -> {
            long count = workspaceMemberRepository.countByWorkspaceIdAndStatus(entity.getId(), "ACTIVE");
            String role = getUserRoleInWorkspace(entity, userId);
            return workspaceMapper.toDto(entity, count, role);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspaceDetails(UUID userId, UUID workspaceId) {
        WorkspaceEntity workspace = workspaceRepository.findByIdAndIsDeletedFalse(workspaceId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Workspace not found"));

        verifyMembership(workspace, userId);

        long count = workspaceMemberRepository.countByWorkspaceIdAndStatus(workspace.getId(), "ACTIVE");
        String role = getUserRoleInWorkspace(workspace, userId);

        return workspaceMapper.toDto(workspace, count, role);
    }

    @Override
    @Transactional
    public WorkspaceDto updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request) {
        WorkspaceEntity workspace = workspaceRepository.findByIdAndIsDeletedFalse(workspaceId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Workspace not found"));

        String role = getUserRoleInWorkspace(workspace, userId);
        if (!"OWNER".equals(role) && !"ADMIN".equals(role)) {
            throw new AppException(ResultCode.FORBIDDEN, "Only workspace owners or admins can update settings");
        }

        workspace.setName(request.getName().trim());
        if (request.getDescription() != null) {
            workspace.setDescription(request.getDescription());
        }
        if (request.getIconUrl() != null) {
            workspace.setIconUrl(request.getIconUrl());
        }
        if (request.getThemeColor() != null) {
            workspace.setThemeColor(request.getThemeColor());
        }

        WorkspaceEntity updated = workspaceRepository.save(workspace);
        long count = workspaceMemberRepository.countByWorkspaceIdAndStatus(updated.getId(), "ACTIVE");

        return workspaceMapper.toDto(updated, count, role);
    }

    @Override
    @Transactional
    public void deleteWorkspace(UUID userId, UUID workspaceId) {
        WorkspaceEntity workspace = workspaceRepository.findByIdAndIsDeletedFalse(workspaceId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Workspace not found"));

        if (!workspace.getOwnerId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "Only the workspace owner can delete this workspace");
        }

        workspace.setIsDeleted(true);
        workspace.setDeletedAt(Instant.now());
        workspaceRepository.save(workspace);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceMemberDto> getWorkspaceMembers(UUID userId, UUID workspaceId) {
        WorkspaceEntity workspace = workspaceRepository.findByIdAndIsDeletedFalse(workspaceId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Workspace not found"));

        verifyMembership(workspace, userId);

        List<WorkspaceMemberEntity> memberEntities = workspaceMemberRepository.findByWorkspaceId(workspaceId);
        List<WorkspaceMemberDto> members = new ArrayList<>();

        for (WorkspaceMemberEntity entity : memberEntities) {
            UserDto userDto = null;
            try {
                userDto = userService.getCurrentUserProfile(entity.getUserId());
            } catch (Exception ignored) {
            }
            members.add(workspaceMapper.toMemberDto(entity, userDto));
        }

        return members;
    }

    private String generateSlug(String name, String customSlug) {
        if (customSlug != null && !customSlug.isBlank()) {
            return customSlug.toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-");
        }
        return name.toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-");
    }

    private void verifyMembership(WorkspaceEntity workspace, UUID userId) {
        if (workspace.getOwnerId().equals(userId)) {
            return;
        }
        boolean isMember = workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspace.getId(), userId);
        if (!isMember) {
            throw new AppException(ResultCode.FORBIDDEN, "Access denied to this workspace");
        }
    }

    private String getUserRoleInWorkspace(WorkspaceEntity workspace, UUID userId) {
        if (workspace.getOwnerId().equals(userId)) {
            return "OWNER";
        }
        Optional<WorkspaceMemberEntity> member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspace.getId(), userId);
        return member.map(WorkspaceMemberEntity::getRole).orElse("MEMBER");
    }
}
