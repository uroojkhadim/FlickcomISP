import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '@/types/auth';
import toast from 'react-hot-toast';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        // Mock API call - replace with actual API integration
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock authentication (saeeddultana@gmail.com / saeeddultana1430)
        if (credentials.email === 'saeeddultana@gmail.com' && credentials.password === 'saeeddultana1430') {
          const mockUser: User = {
            id: '1',
            name: 'Saeed Dultan',
            email: 'saeeddultana@gmail.com',
            phone: '+1234567890',
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });

          // Store in localStorage for persistence
          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          
          toast.success('Login successful!');
        } else {
          toast.error('Invalid email or password');
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        toast.success('Logged out successfully');
      },

      updateUser: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
        toast.success('Profile updated successfully');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
