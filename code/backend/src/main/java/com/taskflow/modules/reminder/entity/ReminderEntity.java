package com.taskflow.modules.reminder.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reminders")
public class ReminderEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Column(name = "remind_at", nullable = false)
    private LocalDateTime remindAt;

    public ReminderEntity() {}

    public ReminderEntity(UUID id, UUID taskId, LocalDateTime remindAt) {
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
