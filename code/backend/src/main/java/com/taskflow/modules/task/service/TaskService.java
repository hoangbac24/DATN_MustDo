package com.taskflow.modules.task.service;

import com.taskflow.modules.task.dto.TaskDto;
import java.util.List;

public interface TaskService {
    List<TaskDto> getTasks();
}
