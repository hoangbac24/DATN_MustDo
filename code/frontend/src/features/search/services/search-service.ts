import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { GlobalSearchResultDto, SearchQueryParams } from '../types';

export const searchService = {
  globalSearch: async (params: SearchQueryParams): Promise<GlobalSearchResultDto> => {
    const res = await apiClient.get<ApiResponse<GlobalSearchResultDto>>('/search', {
      params,
    });
    return res.data.data;
  },
};
