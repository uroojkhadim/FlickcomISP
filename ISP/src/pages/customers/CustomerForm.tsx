import { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Package } from 'lucide-react';
import { useCreateCustomer, useUpdateCustomer, useCustomer } from '@/hooks/useCustomers';
import { usePackages } from '@/hooks/usePackages';
import { ROUTES } from '@/config/constants';
import toast from 'react-hot-toast';

// Zod validation schema
const customerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be 5 digits'),
  packageId: z.string().min(1, 'Please select a package'),
  connectionDate: z.string().min(1, 'Connection date is required'),
  ipAddress: z.string().optional(),
  macAddress: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: customer, isLoading: loadingCustomer } = useCustomer(id || '');
  const { data: packages } = usePackages({ status: 'active' });
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      packageId: '',
      connectionDate: new Date().toISOString().split('T')[0],
      ipAddress: '',
      macAddress: '',
    },
  });

  // Load customer data for editing
  useEffect(() => {
    if (isEdit && customer && !loadingCustomer) {
      reset({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        packageId: customer.packageId,
        connectionDate: customer.connectionDate.split('T')[0],
        ipAddress: customer.ipAddress || '',
        macAddress: customer.macAddress || '',
      });
    }
  }, [customer, isEdit, loadingCustomer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate(ROUTES.CUSTOMERS);
    } catch (error) {
      toast.error(isEdit ? 'Failed to update customer' : 'Failed to create customer');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update customer information' : 'Create a new customer account'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<X size={20} />}
          onClick={() => navigate(ROUTES.CUSTOMERS)}
        >
          Cancel
        </Button>
      </Box>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, mt: 2 }}>
                  Address Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Street Address"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapPin size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ZIP Code"
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>

              {/* Package & Connection */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, mt: 2 }}>
                  Package & Connection
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="packageId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Internet Package"
                      error={!!errors.packageId}
                      helperText={errors.packageId?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Package size={20} />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {packages?.map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - ${pkg.price}/mo
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="connectionDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Connection Date"
                      type="date"
                      error={!!errors.connectionDate}
                      helperText={errors.connectionDate?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="ipAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="IP Address (Optional)"
                      error={!!errors.ipAddress}
                      helperText={errors.ipAddress?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="macAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="MAC Address (Optional)"
                      error={!!errors.macAddress}
                      helperText={errors.macAddress?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.CUSTOMERS)}
                startIcon={<X size={20} />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<Save size={20} />}
                sx={{
                  bgcolor: '#FF9800',
                  '&:hover': { bgcolor: '#F57C00' },
                }}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
