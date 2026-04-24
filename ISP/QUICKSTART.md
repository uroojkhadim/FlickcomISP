# Quick Start Guide - ISP Admin Panel

## 🎯 Getting Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```
The application will automatically open at http://localhost:3000

### Step 2: Login
Use the demo credentials:
- **Email**: admin@admin.com
- **Password**: admin123

### Step 3: Explore
After login, you'll have access to:
- **Dashboard** - View statistics and recent activities
- **Customers** - Customer management module
- **Packages** - Internet package management
- **Billing** - Bill and payment management
- **Support Tickets** - Customer support system
- **Reports** - Business analytics
- **Notifications** - Send notifications
- **User Management** - Manage admin/staff users
- **Settings** - Profile and system settings

## 🎨 Key Features to Try

1. **Toggle Dark Mode** - Click the sun/moon icon in the top bar
2. **Collapse Sidebar** - Click the chevron icon in the sidebar
3. **User Menu** - Click your avatar in the top right for profile options
4. **Responsive Design** - Resize your browser to see mobile/tablet views
5. **Persistent Login** - Refresh the page - you'll stay logged in!

## 📱 Navigation

### Sidebar Menu
- **Desktop**: Always visible, collapsible
- **Tablet/Mobile**: Hamburger menu icon in top left

### Top Bar Features
- **Search Bar** - Global search (UI ready)
- **Theme Toggle** - Switch between light and dark mode
- **Notifications** - Bell icon with badge count
- **User Menu** - Profile, Settings, Logout

## 🔧 Project Structure Overview

```
src/
├── components/     # Reusable UI components
├── config/         # Theme, routes, constants
├── pages/          # Page components
├── stores/         # Zustand state management
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

## 🚀 Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 📦 Adding New Features

### Add a New Page
1. Create page in `src/pages/`
2. Add route in `src/config/routes.tsx`
3. Add to sidebar menu in `src/components/layout/Sidebar.tsx`

### Add a New Component
1. Create component in `src/components/`
2. Import and use in your pages

### Add API Integration
1. Create API file in `src/api/`
2. Use React Query in your components
3. Update stores with real API calls

## 🎨 Customizing the Theme

Edit `src/config/theme.ts` to customize:
- Colors
- Typography
- Component styles
- Spacing

## 💡 Tips

- All forms use React Hook Form + Zod validation
- State is managed with Zustand stores
- Data fetching uses React Query
- Routing is handled by React Router v6
- UI components are from Material-UI

## 🐛 Troubleshooting

**Server won't start:**
```bash
npm install
npm run dev
```

**Login not working:**
- Check console for errors
- Verify credentials: admin@admin.com / admin123

**Styles not loading:**
- Clear browser cache
- Restart dev server

## 📚 Learn More

- **Material-UI**: https://mui.com/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://docs.pmnd.rs/zustand
- **React Query**: https://tanstack.com/query
- **TypeScript**: https://www.typescriptlang.org/

---

**Happy Coding! 🚀**
