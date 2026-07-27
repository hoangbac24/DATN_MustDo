package com.taskflow.modules.task.service.impl;

import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Override
    public List<TaskDto> getTasks() {
        return Collections.emptyList();
    }
}
