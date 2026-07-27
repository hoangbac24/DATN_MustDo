package com.taskflow.modules.project.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjects()));
    }
}
