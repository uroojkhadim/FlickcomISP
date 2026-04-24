import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';
import { TicketFormData } from '@/types/ticket';
import toast from 'react-hot-toast';

export function useTickets(filters?: { status?: string; priority?: string; search?: string }) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getAll(filters),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TicketFormData) => ticketService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Ticket created successfully');
    },
    onError: () => {
      toast.error('Failed to create ticket');
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TicketFormData> }) =>
      ticketService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Ticket updated successfully');
    },
    onError: () => {
      toast.error('Failed to update ticket');
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ticketService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Ticket deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete ticket');
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      ticketService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Ticket status updated');
    },
    onError: () => {
      toast.error('Failed to update ticket status');
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, assignedTo, assignedToName }: { id: string; assignedTo: string; assignedToName: string }) =>
      ticketService.assignTo(id, assignedTo, assignedToName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign ticket');
    },
  });
}
