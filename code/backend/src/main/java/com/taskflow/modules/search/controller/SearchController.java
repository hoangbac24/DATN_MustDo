package com.taskflow.modules.search.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.service.SearchService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Tag(name = "Global Search", description = "Endpoints for unified global search across tasks, projects, tags, and comments")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/api/v1/search")
    @Operation(summary = "Perform global search")
    public ResponseEntity<ApiResponse<GlobalSearchResultDto>> globalSearch(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "ALL") String type,
            @RequestParam(required = false) UUID workspaceId,
            @RequestParam(required = false) UUID projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        SearchQueryParams params = new SearchQueryParams(
                q, type, workspaceId, projectId, status, priority, sortBy, sortOrder, page, size
        );

        GlobalSearchResultDto result = searchService.globalSearch(principal.getId(), params);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", result));
    }
}
