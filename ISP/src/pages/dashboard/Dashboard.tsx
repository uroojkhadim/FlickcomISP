import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  Users,
  UserCheck,
  UserX,
  Wifi,
  DollarSign,
  CreditCard,
  Package,
  Ticket,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useDashboard, useRevenueData, useRecentActivities } from '@/hooks/useDashboard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

const statsConfig = [
  {
    title: 'Total Customers',
    key: 'totalCustomers',
    icon: Users,
    gradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-700',
  },
  {
    title: 'Active Customers',
    key: 'activeCustomers',
    icon: UserCheck,
    gradient: 'from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-500',
    textColor: 'text-emerald-700',
  },
  {
    title: 'Inactive Customers',
    key: 'inactiveCustomers',
    icon: UserX,
    gradient: 'from-rose-50 to-rose-100',
    iconBg: 'bg-rose-500',
    textColor: 'text-rose-700',
  },
  {
    title: 'Monthly Revenue',
    key: 'monthlyRevenue',
    icon: CreditCard,
    gradient: 'from-violet-50 to-violet-100',
    iconBg: 'bg-violet-500',
    textColor: 'text-violet-700',
  },
  {
    title: 'Pending Payments',
    key: 'pendingPayments',
    icon: DollarSign,
    gradient: 'from-amber-50 to-amber-100',
    iconBg: 'bg-amber-500',
    textColor: 'text-amber-700',
  },
  {
    title: 'Active Packages',
    key: 'activePackages',
    icon: Package,
    gradient: 'from-cyan-50 to-cyan-100',
    iconBg: 'bg-cyan-500',
    textColor: 'text-cyan-700',
  },
  {
    title: 'Support Tickets',
    key: 'supportTickets',
    icon: Ticket,
    gradient: 'from-orange-50 to-orange-100',
    iconBg: 'bg-orange-500',
    textColor: 'text-orange-700',
  },
  {
    title: 'New Connections',
    key: 'newConnections',
    icon: Wifi,
    gradient: 'from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-500',
    textColor: 'text-indigo-700',
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: loadingStats } = useDashboard();
  const { data: revenueData, isLoading: loadingRevenue } = useRevenueData();
  const { data: activities } = useRecentActivities();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your ISP business today.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          const value = stats ? (stats as any)[stat.key] : 0;
          
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
                className={`bg-gradient-to-br ${stat.gradient}`}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className={`${stat.iconBg} text-white`}
                    >
                      <Icon size={28} />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <ArrowUpRight size={16} className="text-green-600" />
                      <Typography variant="caption" fontWeight="bold" className="text-green-700">
                        +12%
                      </Typography>
                    </Box>
                  </Box>
                  
                  {loadingStats ? (
                    <>
                      <Skeleton variant="text" width={100} height={40} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width={120} height={24} />
                    </>
                  ) : (
                    <>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        gutterBottom
                        className={stat.textColor}
                      >
                        {stat.key.includes('Revenue') || stat.key.includes('Payments') 
                          ? formatCurrency(value) 
                          : value?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        {stat.title}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Revenue Analytics
                </Typography>
                <TrendingUp size={20} className="text-orange-500" />
              </Box>
              {loadingRevenue ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <RevenueChart data={revenueData || []} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activities
              </Typography>
              <RecentActivity activities={activities || []} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
