package com.taskflow.modules.attachment.dto;

import java.util.UUID;

public class AttachmentDto {
    private UUID id;
    private String fileName;
    private String fileUrl;
    private Long fileSize;

    public AttachmentDto() {}

    public AttachmentDto(UUID id, String fileName, String fileUrl, Long fileSize) {
        this.id = id;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
}
