import { User } from '@/types/auth';
import { mockApi } from './mockApi';

const STORAGE_KEY = 'isp_users';

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'technician';
  status: 'active' | 'inactive';
}

export const userService = {
  getAll: async (filters?: { role?: string; search?: string }) => {
    return mockApi.getAll<User>(STORAGE_KEY, filters);
  },
  
  getById: async (id: string) => {
    return mockApi.getById<User>(STORAGE_KEY, id);
  },
  
  create: async (data: UserFormData) => {
    return mockApi.create<User>(STORAGE_KEY, data);
  },
  
  update: async (id: string, data: Partial<UserFormData>) => {
    return mockApi.update<User>(STORAGE_KEY, id, data);
  },
  
  delete: async (id: string) => {
    return mockApi.remove(STORAGE_KEY, id);
  },
  
  toggleStatus: async (id: string, status: 'active' | 'inactive') => {
    return mockApi.update<User>(STORAGE_KEY, id, { status });
  },
  
  bulkDelete: async (ids: string[]) => {
    return mockApi.bulkDelete(STORAGE_KEY, ids);
  },
  
  getStats: async (role?: string) => {
    return mockApi.getStats(STORAGE_KEY, role ? { status: role } : undefined);
  },
};
