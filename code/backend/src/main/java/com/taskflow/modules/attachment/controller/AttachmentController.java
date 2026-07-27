package com.taskflow.modules.attachment.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.attachment.dto.AttachmentDto;
import com.taskflow.modules.attachment.service.AttachmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> getAttachments() {
        return ResponseEntity.ok(ApiResponse.success(attachmentService.getAttachments()));
    }
}
