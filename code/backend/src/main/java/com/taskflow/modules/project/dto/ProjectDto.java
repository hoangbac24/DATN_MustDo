package com.taskflow.modules.project.dto;

import java.util.UUID;

public class ProjectDto {
    private UUID id;
    private String name;
    private String description;
    private UUID workspaceId;

    public ProjectDto() {}

    public ProjectDto(UUID id, String name, String description, UUID workspaceId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.workspaceId = workspaceId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(UUID workspaceId) { this.workspaceId = workspaceId; }
}
