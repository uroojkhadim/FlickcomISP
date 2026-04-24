import { Customer, CustomerFormData } from '@/types/customer';
import { mockApi } from './mockApi';

const STORAGE_KEY = 'isp_customers';

export const customerService = {
  getAll: async (filters?: { status?: string; search?: string }) => {
    return mockApi.getAll<Customer>(STORAGE_KEY, filters);
  },
  
  getById: async (id: string) => {
    return mockApi.getById<Customer>(STORAGE_KEY, id);
  },
  
  create: async (data: CustomerFormData) => {
    // Enrich with package name if packageId exists
    let enrichedData = { ...data };
    if (data.packageId) {
      try {
        const pkg = await mockApi.getById<any>('isp_packages', data.packageId);
        if (pkg) {
          (enrichedData as any).packageName = pkg.name;
        }
      } catch (e) {
        console.error('Failed to fetch package name', e);
      }
    }
    return mockApi.create<Customer>(STORAGE_KEY, enrichedData);
  },
  
  update: async (id: string, data: Partial<CustomerFormData>) => {
    // Enrich with package name if packageId is being updated
    let enrichedData = { ...data };
    if (data.packageId) {
      try {
        const pkg = await mockApi.getById<any>('isp_packages', data.packageId);
        if (pkg) {
          (enrichedData as any).packageName = pkg.name;
        }
      } catch (e) {
        console.error('Failed to fetch package name', e);
      }
    }
    return mockApi.update<Customer>(STORAGE_KEY, id, enrichedData);
  },
  
  delete: async (id: string) => {
    return mockApi.remove(STORAGE_KEY, id);
  },
  
  bulkDelete: async (ids: string[]) => {
    return mockApi.bulkDelete(STORAGE_KEY, ids);
  },
  
  bulkCreate: async (dataList: CustomerFormData[]) => {
    // Fetch all packages to enrich data with package names
    const packages = await mockApi.getAll<any>('isp_packages');
    
    const enrichedList = dataList.map(data => {
      const pkg = packages.find(p => p.id === data.packageId || p.name === data.packageName);
      return {
        ...data,
        packageId: pkg?.id || data.packageId,
        packageName: pkg?.name || (data as any).packageName,
      };
    });

    return mockApi.bulkCreate<Customer>(STORAGE_KEY, enrichedList);
  },
  
  getStats: async (status?: string) => {
    return mockApi.getStats(STORAGE_KEY, status ? { status } : undefined);
  },
};
