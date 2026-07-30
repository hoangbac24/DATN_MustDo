package com.taskflow.modules.task.mapper;

import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.entity.TaskEntity;
import com.taskflow.modules.user.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toDto(TaskEntity entity, UserDto assignee) {
        if (entity == null) {
            return null;
        }

        return new TaskDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getPriority(),
                entity.getDueDate(),
                entity.getProjectId(),
                entity.getAssigneeId(),
                assignee,
                entity.getPosition(),
                entity.getIsArchived(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
