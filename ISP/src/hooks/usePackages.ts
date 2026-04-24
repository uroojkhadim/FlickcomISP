import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/services/packageService';
import { PackageFormData } from '@/types/package';
import toast from 'react-hot-toast';

export function usePackages(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['packages', filters],
    queryFn: () => packageService.getAll(filters),
  });
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => packageService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PackageFormData) => packageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Package created successfully');
    },
    onError: () => {
      toast.error('Failed to create package');
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PackageFormData> }) =>
      packageService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['package'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Package updated successfully');
    },
    onError: () => {
      toast.error('Failed to update package');
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => packageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Package deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete package');
    },
  });
}

export function useTogglePackageStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      packageService.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Package status updated');
    },
    onError: () => {
      toast.error('Failed to update package status');
    },
  });
}
