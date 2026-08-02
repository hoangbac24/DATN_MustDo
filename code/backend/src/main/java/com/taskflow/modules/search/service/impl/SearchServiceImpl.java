package com.taskflow.modules.search.service.impl;

import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.provider.SearchProvider;
import com.taskflow.modules.search.service.SearchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SearchServiceImpl implements SearchService {

    private final SearchProvider searchProvider;

    public SearchServiceImpl(SearchProvider searchProvider) {
        this.searchProvider = searchProvider;
    }

    @Override
    @Transactional(readOnly = true)
    public GlobalSearchResultDto globalSearch(UUID userId, SearchQueryParams params) {
        return searchProvider.search(userId, params);
    }
}
