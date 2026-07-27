package com.taskflow.modules.project.service.impl;

import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Override
    public List<ProjectDto> getProjects() {
        return Collections.emptyList();
    }
}
