package com.taskflow.modules.search.service;

import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;

import java.util.UUID;

/**
 * Domain Service interface for global aggregated search.
 */
public interface SearchService {

    /**
     * Performs a global multi-entity search across tasks, projects, tags, and comments.
     *
     * @param userId UUID identifier of requesting user
     * @param params search parameters and filters
     * @return GlobalSearchResultDto payload
     */
    GlobalSearchResultDto globalSearch(UUID userId, SearchQueryParams params);
}
