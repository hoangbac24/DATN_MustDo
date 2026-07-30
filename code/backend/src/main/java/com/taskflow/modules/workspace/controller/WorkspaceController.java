package com.taskflow.modules.workspace.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.workspace.dto.CreateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.UpdateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.dto.WorkspaceMemberDto;
import com.taskflow.modules.workspace.service.WorkspaceService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@Tag(name = "Workspace Management", description = "Endpoints for managing workspaces and memberships")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    @Operation(summary = "Create a new workspace")
    public ResponseEntity<ApiResponse<WorkspaceDto>> createWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateWorkspaceRequest request) {
        WorkspaceDto workspace = workspaceService.createWorkspace(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workspace created successfully", workspace));
    }

    @GetMapping
    @Operation(summary = "Get all workspaces for the authenticated user")
    public ResponseEntity<ApiResponse<List<WorkspaceDto>>> getUserWorkspaces(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WorkspaceDto> workspaces = workspaceService.getUserWorkspaces(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Workspaces retrieved successfully", workspaces));
    }

    @GetMapping("/{workspaceId}")
    @Operation(summary = "Get workspace details by ID")
    public ResponseEntity<ApiResponse<WorkspaceDto>> getWorkspaceDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        WorkspaceDto workspace = workspaceService.getWorkspaceDetails(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace details retrieved successfully", workspace));
    }

    @PutMapping("/{workspaceId}")
    @Operation(summary = "Update workspace settings")
    public ResponseEntity<ApiResponse<WorkspaceDto>> updateWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody UpdateWorkspaceRequest request) {
        WorkspaceDto updated = workspaceService.updateWorkspace(principal.getId(), workspaceId, request);
        return ResponseEntity.ok(ApiResponse.success("Workspace updated successfully", updated));
    }

    @DeleteMapping("/{workspaceId}")
    @Operation(summary = "Delete (soft-delete) a workspace")
    public ResponseEntity<ApiResponse<Void>> deleteWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        workspaceService.deleteWorkspace(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace deleted successfully", null));
    }

    @GetMapping("/{workspaceId}/members")
    @Operation(summary = "Get members of a workspace")
    public ResponseEntity<ApiResponse<List<WorkspaceMemberDto>>> getWorkspaceMembers(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        List<WorkspaceMemberDto> members = workspaceService.getWorkspaceMembers(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace members retrieved successfully", members));
    }
}
