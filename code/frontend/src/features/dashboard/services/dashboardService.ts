import { apiClient } from '@/lib/apiClient';

export const dashboardService = {
  async getStats() {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};
