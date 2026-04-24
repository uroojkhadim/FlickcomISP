import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import Logo from '@/components/common/Logo';

interface TopBarProps {
  setMobileOpen: (open: boolean) => void;
}

export default function TopBar({ setMobileOpen }: TopBarProps) {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${isCollapsed ? 72 : 260}px)` },
        ml: { md: isCollapsed ? 72 : 260 },
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        {/* Menu button for mobile */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search bar */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            maxWidth: 600,
          }}
        >
          <Search size={20} color="#999" />
          <InputBase
            placeholder="Search..."
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          {/* Logo for branding */}
          <Logo size="sm" variant="compact" showText={true} />
          {/* Theme toggle */}
          <IconButton onClick={toggleTheme} size="small">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* Notifications */}
          <IconButton size="small">
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* User menu */}
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: 14,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { minWidth: 200, mt: 1 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate(ROUTES.PROFILE_SETTINGS); handleMenuClose(); }}>
              <User size={16} style={{ marginRight: 8 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate(ROUTES.SETTINGS); handleMenuClose(); }}>
              <Settings size={16} style={{ marginRight: 8 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
