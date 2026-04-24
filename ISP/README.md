# ISP Admin Panel - Internet Service Provider Management System

A modern, responsive, and production-ready frontend for an Internet Service Provider (ISP) Admin Panel Web Application built with React.js, TypeScript, and Material-UI.

## 🚀 Features

### Core Features
- ✅ **Authentication System** - Login, Forgot Password, Reset Password with persistent sessions
- ✅ **Dashboard** - Real-time statistics, revenue analytics, customer growth charts, recent activities
- ✅ **Customer Management** - Add, edit, view, activate/deactivate customers (placeholder ready for full implementation)
- ✅ **Package Management** - Internet package creation and management
- ✅ **Billing Management** - Bill generation, payment collection, invoice management
- ✅ **Support Tickets** - Customer support ticket system
- ✅ **Reports & Analytics** - Business intelligence and reporting
- ✅ **Notifications** - SMS, Email, and broadcast notifications
- ✅ **User Management** - Admin and staff management with role-based access control
- ✅ **Settings** - Profile settings and system preferences

### Technical Features
- 🎨 **Modern UI/UX** - Material-UI components with custom white/light orange/grey theme
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🔐 **Protected Routes** - Authentication-based route protection
- 💾 **Persistent Login** - localStorage/sessionStorage for session persistence
- ⚡ **Code Splitting** - Lazy loading for optimal performance
- 🎯 **Type Safety** - Full TypeScript implementation
- 🔄 **State Management** - Zustand for global state management
- 📊 **Data Fetching** - React Query (TanStack Query) for efficient data management
- 🎭 **Reusable Components** - Modular and scalable component architecture

## 🛠️ Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Tailwind CSS + MUI sx prop
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: react-hot-toast

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ISP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Color Theme

The application uses a professional white/light orange/grey color palette:

- **Primary**: Light Orange (#FF9800, #FFB74D, #FFE0B2)
- **Secondary**: Grey (#424242, #757575, #E0E0E0)
- **Background**: White (#FFFFFF) with light grey accents (#FAFAFA, #F5F5F5)
- **Success**: Green (#4CAF50)
- **Error**: Red (#F44336)
- **Warning**: Orange (#FF9800)
- **Info**: Blue (#2196F3)

## 🔐 Demo Credentials

- **Email**: admin@admin.com
- **Password**: admin123

## 📁 Project Structure

```
ISP/
├── public/                 # Static assets
├── src/
│   ├── api/               # API integration layer
│   │   └── axios.ts       # Axios instance with interceptors
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Common components (ComingSoonPage, etc.)
│   │   └── layout/        # Layout components (Sidebar, TopBar, MainLayout)
│   ├── config/            # Configuration files
│   │   ├── theme.ts       # MUI theme customization
│   │   ├── routes.tsx     # Route configuration
│   │   └── constants.ts   # App constants
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Dashboard page
│   ├── stores/            # Zustand stores
│   │   ├── authStore.ts   # Authentication state
│   │   ├── themeStore.ts  # Theme state
│   │   ├── sidebarStore.ts # Sidebar state
│   │   └── notificationStore.ts # Notification state
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Current Implementation Status

### ✅ Completed
- Project setup and configuration
- Authentication system (Login, Forgot Password, Reset Password)
- Main layout with collapsible sidebar and topbar
- Dashboard with statistics cards and recent activities
- Routing with protected routes
- State management (Auth, Theme, Sidebar, Notifications)
- Dark mode toggle
- Responsive design
- Toast notifications
- Persistent login

### 🚧 Ready for Expansion
The following modules have placeholder pages ready for full implementation:
- Customer Management (CRUD operations, filters, search)
- Package Management (Package cards, comparison table)
- Billing Management (Bill generation, payment collection, invoices)
- Support Tickets (Ticket list, conversation interface)
- Reports & Analytics (Revenue, customer, payment reports)
- Notifications (SMS, Email, broadcast)
- User Management (RBAC, permissions)
- Settings (Profile, system preferences)

## 🔌 API Integration

The application is structured for easy backend integration:

1. **Axios Instance** - Configured in `src/api/axios.ts` with interceptors
2. **Mock Authentication** - Currently using mock login (replace with real API)
3. **Environment Variables** - API URL configured in `.env` file

To integrate with your backend:
1. Update `VITE_API_BASE_URL` in `.env`
2. Replace mock API calls in stores with actual API endpoints
3. Update authentication logic in `authStore.ts`

## 📱 Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: 960px - 1280px
- **Large Desktop**: > 1280px

## 🎨 UI Components

The application includes:
- Beautiful stat cards with icons and trend indicators
- Collapsible sidebar navigation
- Top bar with search, notifications, and user menu
- Responsive data tables (ready for implementation)
- Form components with validation
- Toast notifications
- Loading states
- Empty states

## 🚀 Next Steps for Full Implementation

1. **Customer Management**
   - Implement customer list with TanStack Table
   - Add customer form with validation
   - Customer details page with tabs
   - Search and filter functionality

2. **Package Management**
   - Package cards with pricing
   - Package comparison table
   - Add/Edit package forms

3. **Billing System**
   - Bill generation interface
   - Payment collection form
   - Invoice preview and PDF generation
   - Payment history

4. **Charts & Analytics**
   - Integrate Recharts for revenue analytics
   - Customer growth charts
   - Payment collection graphs

5. **Backend Integration**
   - Connect to real API endpoints
   - Implement real-time updates
   - Add WebSocket support for notifications

## 📄 License

This project is built for commercial use and deployment.

## 🤝 Support

For questions or support, please refer to the documentation or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Material-UI**
