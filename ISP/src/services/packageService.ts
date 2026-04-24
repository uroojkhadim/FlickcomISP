import { Package, PackageFormData } from '@/types/package';
import { mockApi } from './mockApi';

const STORAGE_KEY = 'isp_packages';

export const packageService = {
  getAll: async (filters?: { status?: string; search?: string }) => {
    return mockApi.getAll<Package>(STORAGE_KEY, filters);
  },
  
  getById: async (id: string) => {
    return mockApi.getById<Package>(STORAGE_KEY, id);
  },
  
  create: async (data: PackageFormData) => {
    return mockApi.create<Package>(STORAGE_KEY, data);
  },
  
  update: async (id: string, data: Partial<PackageFormData>) => {
    return mockApi.update<Package>(STORAGE_KEY, id, data);
  },
  
  delete: async (id: string) => {
    return mockApi.remove(STORAGE_KEY, id);
  },
  
  toggleStatus: async (id: string, status: 'active' | 'inactive') => {
    return mockApi.update<Package>(STORAGE_KEY, id, { status });
  },
  
  getStats: async (status?: string) => {
    return mockApi.getStats(STORAGE_KEY, status ? { status } : undefined);
  },
};
