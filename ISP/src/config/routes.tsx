import { lazy } from 'react';
import { ROUTES } from '@/config/constants';
import { Bell, Settings } from 'lucide-react';
import ComingSoonPage from '@/components/common/ComingSoonPage';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));

// Auth pages
const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

// Customer pages
const CustomerList = lazy(() => import('@/pages/customers/CustomerList'));
const CustomerForm = lazy(() => import('@/pages/customers/CustomerForm'));

// Package pages
const PackageList = lazy(() => import('@/pages/packages/PackageList'));

// Billing pages
const BillingDashboard = lazy(() => import('@/pages/billing/BillingDashboard'));

// Ticket pages
const TicketList = lazy(() => import('@/pages/tickets/TicketList'));

// User pages
const UserList = lazy(() => import('@/pages/users/UserList'));

// Reports pages
const ReportsDashboard = lazy(() => import('@/pages/reports/ReportsDashboard'));

// Create placeholder pages
const NotificationCenter = () => <ComingSoonPage title="Notifications" description="Send and manage notifications" icon={Bell} />;
const ProfileSettings = () => <ComingSoonPage title="Settings" description="Manage your profile and system settings" icon={Settings} />;

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => JSX.Element> | (() => JSX.Element);
  isProtected?: boolean;
}

export const publicRoutes: RouteConfig[] = [
  { path: ROUTES.LOGIN, element: Login },
  { path: ROUTES.FORGOT_PASSWORD, element: ForgotPassword },
  { path: ROUTES.RESET_PASSWORD, element: ResetPassword },
];

export const protectedRoutes: RouteConfig[] = [
  { path: ROUTES.DASHBOARD, element: Dashboard, isProtected: true },
  { path: ROUTES.CUSTOMERS, element: CustomerList, isProtected: true },
  { path: ROUTES.CUSTOMER_DETAILS, element: CustomerList, isProtected: true },
  { path: ROUTES.ADD_CUSTOMER, element: CustomerForm, isProtected: true },
  { path: ROUTES.EDIT_CUSTOMER, element: CustomerForm, isProtected: true },
  { path: ROUTES.PACKAGES, element: PackageList, isProtected: true },
  { path: ROUTES.ADD_PACKAGE, element: PackageList, isProtected: true },
  { path: ROUTES.EDIT_PACKAGE, element: PackageList, isProtected: true },
  { path: ROUTES.BILLING, element: BillingDashboard, isProtected: true },
  { path: ROUTES.GENERATE_BILLS, element: BillingDashboard, isProtected: true },
  { path: ROUTES.PAYMENT_COLLECTION, element: BillingDashboard, isProtected: true },
  { path: ROUTES.BILL_HISTORY, element: BillingDashboard, isProtected: true },
  { path: ROUTES.TICKETS, element: TicketList, isProtected: true },
  { path: ROUTES.TICKET_DETAILS, element: TicketList, isProtected: true },
  { path: ROUTES.REPORTS, element: ReportsDashboard, isProtected: true },
  { path: ROUTES.NOTIFICATIONS, element: NotificationCenter, isProtected: true },
  { path: ROUTES.USERS, element: UserList, isProtected: true },
  { path: ROUTES.ADD_USER, element: UserList, isProtected: true },
  { path: ROUTES.ROLE_MANAGEMENT, element: UserList, isProtected: true },
  { path: ROUTES.SETTINGS, element: ProfileSettings, isProtected: true },
  { path: ROUTES.PROFILE_SETTINGS, element: ProfileSettings, isProtected: true },
  { path: ROUTES.SYSTEM_PREFERENCES, element: ProfileSettings, isProtected: true },
];
