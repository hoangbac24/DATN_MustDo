package com.taskflow.modules.reminder.service.impl;

import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.service.ReminderService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ReminderServiceImpl implements ReminderService {

    @Override
    public List<ReminderDto> getReminders() {
        return Collections.emptyList();
    }
}
