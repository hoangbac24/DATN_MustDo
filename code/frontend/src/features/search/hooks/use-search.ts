import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search-service';
import type { SearchQueryParams } from '../types';

export const SEARCH_QUERY_KEYS = {
  globalSearch: (params: SearchQueryParams) => ['global-search', params] as const,
};

export function useGlobalSearch(params: SearchQueryParams, enabled = true) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.globalSearch(params),
    queryFn: () => searchService.globalSearch(params),
    enabled: enabled && (!!params.q || !!params.type),
    staleTime: 5000,
  });
}
