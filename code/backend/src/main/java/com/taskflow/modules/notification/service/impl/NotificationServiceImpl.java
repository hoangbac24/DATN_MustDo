package com.taskflow.modules.notification.service.impl;

import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.service.NotificationService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Override
    public List<NotificationDto> getUserNotifications() {
        return Collections.emptyList();
    }
}
