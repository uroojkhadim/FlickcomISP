import { Bill, BillFormData, Payment } from '@/types/billing';
import { mockApi } from './mockApi';

const STORAGE_KEY = 'isp_bills';

export const billingService = {
  getAll: async (filters?: { status?: string; search?: string }) => {
    return mockApi.getAll<Bill>(STORAGE_KEY, filters);
  },
  
  getById: async (id: string) => {
    return mockApi.getById<Bill>(STORAGE_KEY, id);
  },
  
  create: async (data: BillFormData) => {
    return mockApi.create<Bill>(STORAGE_KEY, data);
  },
  
  update: async (id: string, data: Partial<Bill>) => {
    return mockApi.update<Bill>(STORAGE_KEY, id, data);
  },
  
  delete: async (id: string) => {
    return mockApi.remove(STORAGE_KEY, id);
  },
  
  bulkDelete: async (ids: string[]) => {
    return mockApi.bulkDelete(STORAGE_KEY, ids);
  },
  
  markAsPaid: async (id: string, _paymentMethod: Payment['paymentMethod'] = 'cash') => {
    return mockApi.update<Bill>(STORAGE_KEY, id, {
      status: 'paid',
      paidDate: new Date().toISOString(),
    });
  },
  
  getStats: async (status?: string) => {
    return mockApi.getStats(STORAGE_KEY, status ? { status } : undefined);
  },
  
  generateBills: async (bills: BillFormData[]) => {
    const createdBills: Bill[] = [];
    for (const bill of bills) {
      const created = await mockApi.create<Bill>(STORAGE_KEY, bill);
      createdBills.push(created);
    }
    return createdBills;
  },
};
