package com.taskflow.modules.task.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasks() {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasks()));
    }
}
