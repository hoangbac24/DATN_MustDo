package com.taskflow.modules.reminder.service;

import com.taskflow.modules.reminder.dto.ReminderDto;
import java.util.List;

public interface ReminderService {
    List<ReminderDto> getReminders();
}
