package com.taskflow.modules.reminder.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.service.ReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReminderDto>>> getReminders() {
        return ResponseEntity.ok(ApiResponse.success(reminderService.getReminders()));
    }
}
