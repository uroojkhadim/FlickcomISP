import { Ticket, TicketFormData } from '@/types/ticket';
import { mockApi } from './mockApi';

const STORAGE_KEY = 'isp_tickets';

export const ticketService = {
  getAll: async (filters?: { status?: string; priority?: string; search?: string }) => {
    return mockApi.getAll<Ticket>(STORAGE_KEY, filters);
  },
  
  getById: async (id: string) => {
    return mockApi.getById<Ticket>(STORAGE_KEY, id);
  },
  
  create: async (data: TicketFormData) => {
    return mockApi.create<Ticket>(STORAGE_KEY, data);
  },
  
  update: async (id: string, data: Partial<TicketFormData>) => {
    return mockApi.update<Ticket>(STORAGE_KEY, id, data);
  },
  
  delete: async (id: string) => {
    return mockApi.remove(STORAGE_KEY, id);
  },
  
  updateStatus: async (id: string, status: Ticket['status']) => {
    return mockApi.update<Ticket>(STORAGE_KEY, id, { status });
  },
  
  assignTo: async (id: string, assignedTo: string, assignedToName: string) => {
    return mockApi.update<Ticket>(STORAGE_KEY, id, { assignedTo, assignedToName });
  },
  
  bulkDelete: async (ids: string[]) => {
    return mockApi.bulkDelete(STORAGE_KEY, ids);
  },
  
  getStats: async (status?: string) => {
    return mockApi.getStats(STORAGE_KEY, status ? { status } : undefined);
  },
};
