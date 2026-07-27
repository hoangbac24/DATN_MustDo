package com.taskflow.modules.project.service;

import com.taskflow.modules.project.dto.ProjectDto;
import java.util.List;

public interface ProjectService {
    List<ProjectDto> getProjects();
}
