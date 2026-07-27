package com.taskflow.modules.workspace.service.impl;

import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    @Override
    public List<WorkspaceDto> getUserWorkspaces() {
        return Collections.emptyList();
    }
}
