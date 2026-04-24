import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboard, useRevenueData } from '@/hooks/useDashboard';
import { useCustomers } from '@/hooks/useCustomers';
import { useTickets } from '@/hooks/useTickets';
import { formatCurrency } from '@/utils/formatters';
import { Users, Ticket, DollarSign, TrendingUp } from 'lucide-react';

const COLORS = ['#FF9800', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'];

export default function ReportsDashboard() {
  const { data: stats } = useDashboard();
  const { data: revenueData } = useRevenueData();
  const { data: customers } = useCustomers();
  const { data: tickets } = useTickets();

  // Prepare package distribution data
  const packageDistribution = customers?.reduce((acc: any[], customer) => {
    const existing = acc.find((p) => p.name === customer.packageName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: customer.packageName || 'Unknown', value: 1 });
    }
    return acc;
  }, []) || [];

  // Prepare ticket status data
  const ticketStatusData = tickets?.reduce((acc: any[], ticket) => {
    const status = ticket.status.replace('_', ' ');
    const existing = acc.find((s) => s.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []) || [];

  // Customer status distribution
  const customerStatusData = [
    { name: 'Active', value: stats?.activeCustomers || 0 },
    { name: 'Inactive', value: stats?.inactiveCustomers || 0 },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive business insights and statistics
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#EFF6FF' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box p={1.5} borderRadius={2} bgcolor="#3B82F6" color="white">
                  <Users size={24} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#3B82F6">
                    {stats?.totalCustomers?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F0FDF4' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box p={1.5} borderRadius={2} bgcolor="#10B981" color="white">
                  <DollarSign size={24} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#10B981">
                    {formatCurrency(stats?.monthlyRevenue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#FFF7ED' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box p={1.5} borderRadius={2} bgcolor="#F97316" color="white">
                  <Ticket size={24} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Open Tickets
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#F97316">
                    {stats?.supportTickets || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F5F3FF' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box p={1.5} borderRadius={2} bgcolor="#8B5CF6" color="white">
                  <TrendingUp size={24} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    New Connections
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#8B5CF6">
                    {stats?.newConnections || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Monthly Revenue Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#FF9800" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Package Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Package Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={packageDistribution.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {packageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ticket Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
