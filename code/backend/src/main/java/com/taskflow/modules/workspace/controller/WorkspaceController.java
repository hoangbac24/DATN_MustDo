package com.taskflow.modules.workspace.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceDto>>> getWorkspaces() {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getUserWorkspaces()));
    }
}
