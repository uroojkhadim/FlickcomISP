import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/billingService';
import { BillFormData } from '@/types/billing';
import toast from 'react-hot-toast';

export function useBills(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['bills', filters],
    queryFn: () => billingService.getAll(filters),
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: () => billingService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BillFormData) => billingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Bill created successfully');
    },
    onError: () => {
      toast.error('Failed to create bill');
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      billingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Bill updated successfully');
    },
    onError: () => {
      toast.error('Failed to update bill');
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => billingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Bill deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete bill');
    },
  });
}

export function useMarkAsPaid() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod?: any }) =>
      billingService.markAsPaid(id, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Bill marked as paid');
    },
    onError: () => {
      toast.error('Failed to mark bill as paid');
    },
  });
}

export function useGenerateBills() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bills: BillFormData[]) => billingService.generateBills(bills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Bills generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate bills');
    },
  });
}
