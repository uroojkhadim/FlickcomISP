import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Link,
} from '@mui/material';
import { Mail, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import toast from 'react-hot-toast';
import Logo from '@/components/common/Logo';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Password reset requested for:', data.email);
    setSubmitted(true);
    toast.success('Password reset link sent to your email');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FFE0B2 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Centered Logo with proper resolution and scaling */}
          <Logo 
            size="2xl" 
            showText={true} 
            className="mb-8"
          />

          {submitted ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset link has been sent to your email address.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
                {...register('email')}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #F57C00, #EF6C00)',
                  },
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to={ROUTES.LOGIN}
              underline="hover"
              color="primary"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
