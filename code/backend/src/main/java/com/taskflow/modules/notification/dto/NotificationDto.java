package com.taskflow.modules.notification.dto;

import java.util.UUID;

public class NotificationDto {
    private UUID id;
    private String title;
    private String message;
    private boolean read;

    public NotificationDto() {}

    public NotificationDto(UUID id, String title, String message, boolean read) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.read = read;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
