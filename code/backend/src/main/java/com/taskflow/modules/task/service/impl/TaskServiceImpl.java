package com.taskflow.modules.task.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.project.service.ProjectService;
import com.taskflow.modules.task.dto.CreateTaskRequest;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.dto.UpdateTaskRequest;
import com.taskflow.modules.task.entity.TaskEntity;
import com.taskflow.modules.task.mapper.TaskMapper;
import com.taskflow.modules.task.repository.TaskRepository;
import com.taskflow.modules.task.service.TaskService;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            ProjectService projectService,
            UserService userService,
            TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.taskMapper = taskMapper;
    }

    @Override
    @Transactional
    public TaskDto createTask(UUID userId, UUID projectId, CreateTaskRequest request) {
        projectService.getProjectDetails(userId, projectId);

        Double maxPosition = taskRepository.findMaxPositionByProjectId(projectId);
        Double position = request.getPosition() != null ? request.getPosition() : maxPosition + 1000.0;

        TaskEntity task = new TaskEntity(
                request.getTitle().trim(),
                request.getDescription(),
                request.getStatus() != null ? request.getStatus() : "TODO",
                request.getPriority() != null ? request.getPriority() : "MEDIUM",
                request.getDueDate(),
                projectId,
                request.getAssigneeId(),
                position
        );

        TaskEntity saved = taskRepository.save(task);
        UserDto assignee = resolveAssignee(saved.getAssigneeId());

        return taskMapper.toDto(saved, assignee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getProjectTasks(UUID userId, UUID projectId, String status, String priority, String search, Boolean archived) {
        projectService.getProjectDetails(userId, projectId);

        String searchPattern = (search != null && !search.isBlank()) ? search.trim() : null;
        List<TaskEntity> tasks = taskRepository.searchTasks(projectId, status, priority, archived, searchPattern);

        return tasks.stream().map(task -> {
            UserDto assignee = resolveAssignee(task.getAssigneeId());
            return taskMapper.toDto(task, assignee);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskDetails(UUID userId, UUID taskId) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        UserDto assignee = resolveAssignee(task.getAssigneeId());
        return taskMapper.toDto(task, assignee);
    }

    @Override
    @Transactional
    public TaskDto updateTask(UUID userId, UUID taskId, UpdateTaskRequest request) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        task.setAssigneeId(request.getAssigneeId());

        TaskEntity updated = taskRepository.save(task);
        UserDto assignee = resolveAssignee(updated.getAssigneeId());

        return taskMapper.toDto(updated, assignee);
    }

    @Override
    @Transactional
    public TaskDto updateTaskStatus(UUID userId, UUID taskId, String status) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        task.setStatus(status);
        TaskEntity updated = taskRepository.save(task);

        UserDto assignee = resolveAssignee(updated.getAssigneeId());
        return taskMapper.toDto(updated, assignee);
    }

    @Override
    @Transactional
    public TaskDto reorderTask(UUID userId, UUID taskId, Double position) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        task.setPosition(position);
        TaskEntity updated = taskRepository.save(task);

        UserDto assignee = resolveAssignee(updated.getAssigneeId());
        return taskMapper.toDto(updated, assignee);
    }

    @Override
    @Transactional
    public void deleteTask(UUID userId, UUID taskId) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        task.setIsDeleted(true);
        task.setDeletedAt(Instant.now());
        taskRepository.save(task);
    }

    @Override
    @Transactional
    public TaskDto toggleArchiveTask(UUID userId, UUID taskId) {
        TaskEntity task = findActiveTaskById(taskId);
        projectService.getProjectDetails(userId, task.getProjectId());

        task.setIsArchived(!task.getIsArchived());
        TaskEntity updated = taskRepository.save(task);

        UserDto assignee = resolveAssignee(updated.getAssigneeId());
        return taskMapper.toDto(updated, assignee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksWithDueDateInRange(UUID userId, Instant start, Instant end) {
        List<TaskEntity> tasks = taskRepository.findTasksWithDueDateInRange(start, end);
        return tasks.stream().map(task -> {
            UserDto assignee = resolveAssignee(task.getAssigneeId());
            return taskMapper.toDto(task, assignee);
        }).collect(Collectors.toList());
    }

    private TaskEntity findActiveTaskById(UUID taskId) {
        return taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Task not found"));
    }

    private UserDto resolveAssignee(UUID assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        try {
            return userService.getCurrentUserProfile(assigneeId);
        } catch (Exception ignored) {
            return null;
        }
    }
}
