export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ISP Admin Panel';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: '/customers/:id',
  ADD_CUSTOMER: '/customers/add',
  EDIT_CUSTOMER: '/customers/:id/edit',
  PACKAGES: '/packages',
  ADD_PACKAGE: '/packages/add',
  EDIT_PACKAGE: '/packages/:id/edit',
  BILLING: '/billing',
  GENERATE_BILLS: '/billing/generate',
  PAYMENT_COLLECTION: '/billing/payments',
  BILL_HISTORY: '/billing/history',
  TICKETS: '/tickets',
  TICKET_DETAILS: '/tickets/:id',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  USERS: '/users',
  ADD_USER: '/users/add',
  ROLE_MANAGEMENT: '/users/roles',
  SETTINGS: '/settings',
  PROFILE_SETTINGS: '/settings/profile',
  SYSTEM_PREFERENCES: '/settings/system',
} as const;

export const PAGINATION_OPTIONS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  OPTIONS: [10, 25, 50, 100],
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  TECHNICIAN: 'technician',
} as const;

export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export const BILL_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const;

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;
