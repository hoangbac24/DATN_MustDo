package com.taskflow.modules.attachment.service;

import com.taskflow.modules.attachment.dto.AttachmentDto;
import java.util.List;

public interface AttachmentService {
    List<AttachmentDto> getAttachments();
}
