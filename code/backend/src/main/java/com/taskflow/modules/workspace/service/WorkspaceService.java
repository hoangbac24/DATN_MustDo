package com.taskflow.modules.workspace.service;

import com.taskflow.modules.workspace.dto.WorkspaceDto;

import java.util.List;

public interface WorkspaceService {
    List<WorkspaceDto> getUserWorkspaces();
}
