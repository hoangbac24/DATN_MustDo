package com.taskflow.modules.notification.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications()));
    }
}
