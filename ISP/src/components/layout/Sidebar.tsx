import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Ticket,
  BarChart3,
  Bell,
  UserCog,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { ROUTES } from '@/config/constants';
import Logo from '@/components/common/Logo';

const drawerWidth = 260;
const collapsedWidth = 72;

interface MenuItem {
  text: string;
  icon: React.ElementType;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { text: 'Customers', icon: Users, path: ROUTES.CUSTOMERS },
  { text: 'Packages', icon: Package, path: ROUTES.PACKAGES },
  { text: 'Billing', icon: CreditCard, path: ROUTES.BILLING },
  { text: 'Support Tickets', icon: Ticket, path: ROUTES.TICKETS },
  { text: 'Reports', icon: BarChart3, path: ROUTES.REPORTS },
  { text: 'Notifications', icon: Bell, path: ROUTES.NOTIFICATIONS },
  { text: 'User Management', icon: UserCog, path: ROUTES.USERS },
  { text: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'white', color: 'black' }}>
      {/* Logo */}
      <Box
        sx={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 0 : 2,
          gap: 1.5,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Logo size={isCollapsed ? "md" : "lg"} variant="compact" showText={!isCollapsed} />
        {!isCollapsed && !isMobile && (
          <IconButton
            onClick={toggleSidebar}
            sx={{ ml: 'auto', color: 'black', '&:hover': { bgcolor: 'grey.100' } }}
          >
            <ChevronLeft size={20} />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  px: isCollapsed ? '12px' : 2,
                  bgcolor: isActive ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                  color: isActive ? '#FF9800' : 'black',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(255, 152, 0, 0.2)' : 'grey.50',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2 }}>
                  <item.icon
                    size={20}
                    color={isActive ? '#FF9800' : 'inherit'}
                  />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.9rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: isCollapsed ? collapsedWidth : drawerWidth } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: 'white',
            borderRight: '1px solid',
            borderColor: 'grey.200',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isCollapsed ? collapsedWidth : drawerWidth,
            bgcolor: 'white',
            borderRight: '1px solid',
            borderColor: 'grey.200',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
