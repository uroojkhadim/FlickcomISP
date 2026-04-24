import { customerService } from './customerService';
import { billingService } from './billingService';
import { packageService } from './packageService';
import { ticketService } from './ticketService';

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  monthlyRevenue: number;
  pendingPayments: number;
  activePackages: number;
  supportTickets: number;
  newConnections: number;
  openTickets: number;
  resolvedTickets: number;
  overdueBills: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  customers: number;
}

export interface Activity {
  id: string;
  type: 'customer' | 'payment' | 'ticket' | 'package';
  description: string;
  timestamp: string;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const [
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      activePackages,
      openTickets,
      resolvedTickets,
      overdueBills,
    ] = await Promise.all([
      customerService.getStats(),
      customerService.getStats('active'),
      customerService.getStats('inactive'),
      packageService.getStats('active'),
      ticketService.getStats('open'),
      ticketService.getStats('resolved'),
      billingService.getStats('overdue'),
    ]);

    // Get all bills to calculate revenue
    const allBills = await billingService.getAll();
    const monthlyRevenue = allBills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    const pendingPayments = allBills
      .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
      .reduce((sum, bill) => sum + bill.amount, 0);

    // Get customers from last 30 days
    const allCustomers = await customerService.getAll();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newConnections = allCustomers.filter(
      customer => new Date(customer.connectionDate) >= thirtyDaysAgo
    ).length;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      monthlyRevenue,
      pendingPayments,
      activePackages,
      supportTickets: openTickets,
      newConnections,
      openTickets,
      resolvedTickets,
      overdueBills,
    };
  },

  getRevenueData: async (): Promise<RevenueData[]> => {
    const allBills = await billingService.getAll();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group bills by month
    const revenueByMonth = new Map<string, number>();
    
    allBills.forEach(bill => {
      const date = new Date(bill.createdAt);
      const monthKey = months[date.getMonth()];
      
      if (bill.status === 'paid') {
        revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + bill.amount);
      }
    });
    
    // Generate data for all months
    return months.map(month => ({
      month,
      revenue: revenueByMonth.get(month) || 0,
      customers: Math.floor(Math.random() * 50) + 10, // Mock customer growth
    }));
  },

  getRecentActivities: async (): Promise<Activity[]> => {
    const [customers, bills, tickets] = await Promise.all([
      customerService.getAll(),
      billingService.getAll(),
      ticketService.getAll(),
    ]);

    const activities: Activity[] = [];

    // Recent customers
    customers.slice(0, 5).forEach(customer => {
      activities.push({
        id: `act_cust_${customer.id}`,
        type: 'customer',
        description: `New customer registered: ${customer.fullName}`,
        timestamp: customer.createdAt,
      });
    });

    // Recent payments
    bills
      .filter(bill => bill.status === 'paid' && bill.paidDate)
      .slice(0, 5)
      .forEach(bill => {
        activities.push({
          id: `act_pay_${bill.id}`,
          type: 'payment',
          description: `Payment received from ${bill.customerName}: $${bill.amount}`,
          timestamp: bill.paidDate!,
        });
      });

    // Recent tickets
    tickets.slice(0, 5).forEach(ticket => {
      activities.push({
        id: `act_ticket_${ticket.id}`,
        type: 'ticket',
        description: `Ticket ${ticket.ticketNumber}: ${ticket.subject}`,
        timestamp: ticket.createdAt,
      });
    });

    // Sort by timestamp and return top 10
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  },
};
