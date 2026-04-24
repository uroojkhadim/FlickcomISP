import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['revenue'],
    queryFn: () => dashboardService.getRevenueData(),
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => dashboardService.getRecentActivities(),
  });
}
