package com.taskflow.modules.activity.service;

import com.taskflow.common.PageResponse;
import com.taskflow.modules.activity.dto.ActivityLogDto;
import com.taskflow.modules.activity.dto.CreateActivityLogRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Domain Service interface for managing user action logging and activity feeds.
 */
public interface ActivityLogService {

    /**
     * Records a new activity log entry.
     *
     * @param userId  UUID identifier of acting user
     * @param request creation request payload
     * @return ActivityLogDto instance
     */
    ActivityLogDto logActivity(UUID userId, CreateActivityLogRequest request);

    /**
     * Gets paginated activity feed for a user, with optional entityType filter.
     */
    PageResponse<ActivityLogDto> getUserActivities(UUID userId, String entityType, Pageable pageable);

    /**
     * Gets paginated activity feed for a project.
     */
    PageResponse<ActivityLogDto> getProjectActivities(UUID userId, UUID projectId, Pageable pageable);

    /**
     * Gets paginated activity feed for a workspace.
     */
    PageResponse<ActivityLogDto> getWorkspaceActivities(UUID userId, UUID workspaceId, Pageable pageable);
}
