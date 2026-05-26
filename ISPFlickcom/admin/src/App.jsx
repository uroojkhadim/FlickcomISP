import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, FileText,
  AlertTriangle, Settings as SettingsIcon, LogOut, Activity,
  BarChart3, Bell, User, X, MessageCircle
} from 'lucide-react';
import api from './api/axios';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Packages from './pages/Packages';
import Complaints from './pages/Complaints';
import Bills from './pages/Bills';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import SupportChat from './pages/SupportChat';

import Login from './pages/Login';

function Layout({ setToken }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchGlobalData = async () => {
    try {
      const adminRes = await api.get('/admin/profile');
      setAdmin(adminRes.data.data);

      const notifRes = await api.get('/admin/notifications');
      const unread = notifRes.data.data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      // Only log if it's not a 401 (which is handled by interceptor)
      if (err.response?.status !== 401) {
        console.error("Layout data fetch failed:", err.message);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [navigate]);

  // Auto-close sidebar on navigation (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 45, backdropFilter: 'blur(2px)' }}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          Flick Admin
        </div>

        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Customers
          </NavLink>
          <NavLink to="/packages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} /> Data Packages
          </NavLink>
          <NavLink to="/bills" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> Billing
          </NavLink>
          <NavLink to="/complaints" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AlertTriangle size={20} /> Helpdesk
          </NavLink>
          <NavLink to="/support-chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageCircle size={20} /> Support Chat
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart3 size={20} /> Reports
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} /> Notifications
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={20} /> System Settings
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {/* Global Responsive Top Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '2rem', gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'white', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <Activity size={20} className="text-primary-600" />
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)', display: window.innerWidth < 650 ? 'none' : 'block' }}>NETWORK STATUS: <span style={{ color: 'var(--success)' }}>OPERATIONAL</span></h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link to="/notifications" style={{ position: 'relative', color: 'var(--text-main)', background: 'white', padding: '10px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex' }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: 'var(--danger)', color: 'white',
                  fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px',
                  borderRadius: '10px', border: '2px solid white'
                }}>
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-main)', background: 'white', padding: '4px 12px 4px 16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ textAlign: 'right', display: window.innerWidth < 600 ? 'none' : 'block' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{admin?.name || 'Admin'}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Super Admin</p>
              </div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-50)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white'
              }}>
                {admin?.avatar_url ? <img src={admin.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} className="text-primary-600" />}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={28} /> : <LayoutDashboard size={28} />}
        </button>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/support-chat" element={<SupportChat />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<div className="glass-card"><h2 style={{ fontWeight: 700 }}>Coming Soon</h2><p className="page-subtitle">Available in Phase 2</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  // Listen for storage changes (like logout from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('adminToken');
      setToken(currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Layout setToken={setToken} />;
}
