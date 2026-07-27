package com.taskflow.modules.reminder.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReminderDto {
    private UUID id;
    private UUID taskId;
    private LocalDateTime remindAt;

    public ReminderDto() {}

    public ReminderDto(UUID id, UUID taskId, LocalDateTime remindAt) {
        this.id = id;
        this.taskId = taskId;
        this.remindAt = remindAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }

    public LocalDateTime getRemindAt() { return remindAt; }
    public void setRemindAt(LocalDateTime remindAt) { this.remindAt = remindAt; }
}
