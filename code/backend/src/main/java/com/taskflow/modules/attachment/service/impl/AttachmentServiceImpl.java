package com.taskflow.modules.attachment.service.impl;

import com.taskflow.modules.attachment.dto.AttachmentDto;
import com.taskflow.modules.attachment.service.AttachmentService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    @Override
    public List<AttachmentDto> getAttachments() {
        return Collections.emptyList();
    }
}
