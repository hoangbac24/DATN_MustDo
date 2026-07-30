package com.taskflow.modules.task.service;

import com.taskflow.modules.task.dto.CreateTaskRequest;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.dto.UpdateTaskRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing project tasks, statuses, priorities, due dates, and reordering.
 */
public interface TaskService {

    /**
     * Creates a new task within a project.
     *
     * @param userId    UUID identifier of the creator
     * @param projectId UUID identifier of the target project
     * @param request   creation request payload
     * @return TaskDto representation of the created task
     */
    TaskDto createTask(UUID userId, UUID projectId, CreateTaskRequest request);

    /**
     * Retrieves tasks within a project matching status, priority, search text, or archived state.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @param status    optional filter status (TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED)
     * @param priority  optional filter priority (LOW, MEDIUM, HIGH, URGENT)
     * @param search    optional search string matching title or description
     * @param archived  optional filter for archived tasks
     * @return list of matching TaskDto instances
     */
    List<TaskDto> getProjectTasks(UUID userId, UUID projectId, String status, String priority, String search, Boolean archived);

    /**
     * Retrieves task details by ID.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return TaskDto instance
     */
    TaskDto getTaskDetails(UUID userId, UUID taskId);

    /**
     * Updates task title, description, status, priority, due date, and assignee.
     *
     * @param userId  UUID identifier of the requesting user
     * @param taskId  UUID identifier of the target task
     * @param request update request payload
     * @return updated TaskDto instance
     */
    TaskDto updateTask(UUID userId, UUID taskId, UpdateTaskRequest request);

    /**
     * Updates only the status of a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @param status new task status string
     * @return updated TaskDto instance
     */
    TaskDto updateTaskStatus(UUID userId, UUID taskId, String status);

    /**
     * Updates the position order value for list/Kanban drag-and-drop.
     *
     * @param userId   UUID identifier of the requesting user
     * @param taskId   UUID identifier of the target task
     * @param position double precision ordering index
     * @return updated TaskDto instance
     */
    TaskDto reorderTask(UUID userId, UUID taskId, Double position);

    /**
     * Soft-deletes a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     */
    void deleteTask(UUID userId, UUID taskId);

    /**
     * Toggles the archived status of a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return updated TaskDto instance
     */
    TaskDto toggleArchiveTask(UUID userId, UUID taskId);
}
