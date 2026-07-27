package com.taskflow.modules.notification.service;

import com.taskflow.modules.notification.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    List<NotificationDto> getUserNotifications();
}
