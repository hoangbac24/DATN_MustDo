package com.taskflow.modules.workspace.service;

import com.taskflow.modules.workspace.dto.CreateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.UpdateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.dto.WorkspaceMemberDto;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing workspace creation, membership roles, settings, and soft-deletion.
 */
public interface WorkspaceService {

    /**
     * Creates a new workspace and registers the creator as OWNER.
     *
     * @param ownerId UUID identifier of the workspace owner
     * @param request creation request payload
     * @return WorkspaceDto of the created workspace
     */
    WorkspaceDto createWorkspace(UUID ownerId, CreateWorkspaceRequest request);

    /**
     * Retrieves all active workspaces accessible by the user.
     *
     * @param userId UUID identifier of the requesting user
     * @return list of accessible WorkspaceDto instances
     */
    List<WorkspaceDto> getUserWorkspaces(UUID userId);

    /**
     * Retrieves detailed information of a specific workspace, verifying membership access.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @return WorkspaceDto instance
     */
    WorkspaceDto getWorkspaceDetails(UUID userId, UUID workspaceId);

    /**
     * Updates workspace settings (name, description, theme color).
     * Requires OWNER or ADMIN role.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @param request     update payload
     * @return updated WorkspaceDto instance
     */
    WorkspaceDto updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request);

    /**
     * Soft-deletes a workspace. Requires OWNER role.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     */
    void deleteWorkspace(UUID userId, UUID workspaceId);

    /**
     * Retrieves list of active workspace members and assigned roles.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @return list of WorkspaceMemberDto instances
     */
    List<WorkspaceMemberDto> getWorkspaceMembers(UUID userId, UUID workspaceId);
}
