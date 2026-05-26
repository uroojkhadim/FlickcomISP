import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertCircle, UserPlus, FileText, ChevronRight, Clock } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (n) => {
    try {
        if (!n.is_read) {
            await api.put(`/admin/notifications/${n.id}/read`);
        }
        
        // Navigation logic based on type
        switch(n.type) {
            case 'complaint':
                navigate('/complaints', { state: { search: n.target_id } });
                break;
            case 'bill':
                navigate('/bills', { state: { search: n.target_id } });
                break;
            case 'user':
                navigate('/customers', { state: { search: n.target_id } });
                break;
            default:
                break;
        }
    } catch(err) {
        console.error("Link error", err);
    }
  };

  const markAllRead = async () => {
      // Future: batch update
      alert("All marked as read");
  };

  const getIcon = (type) => {
      switch(type) {
          case 'user': return <UserPlus className="text-blue-500" />;
          case 'complaint': return <AlertCircle className="text-orange-500" />;
          case 'bill': return <FileText className="text-green-500" />;
          default: return <Bell className="text-primary-500" />;
      }
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="page-title">Notifications Center</h1>
          <p className="page-subtitle">Manage alerts for new registrations, billing, and support requests.</p>
        </div>
        <button className="btn btn-outline" onClick={markAllRead}>Mark All as Read</button>
      </div>

      <div className="glass-card" style={{padding:0, overflow:'hidden'}}>
        {loading ? <div style={{padding:'2rem'}}><div className="spinner"></div></div> : 
         notifications.length === 0 ? <div style={{padding:'3rem', textAlign:'center', color: 'var(--text-muted)'}}>No new notifications.</div> :
         notifications.map((n, idx) => (
            <div 
                key={n.id} 
                onClick={() => handleRead(n)}
                style={{
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    background: n.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                    borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid var(--border-light)'
                }}
                className="notification-item"
            >
                <div style={{
                    width:'48px', height:'48px', borderRadius:'12px', background: 'white', 
                    boxShadow: 'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                    {getIcon(n.type)}
                </div>

                <div style={{flex: 1}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom: '2px'}}>
                        <h4 style={{fontWeight: 700, fontSize:'1.05rem', margin:0}}>{n.title}</h4>
                        {!n.is_read && <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'var(--primary-500)'}}></div>}
                    </div>
                    <p style={{margin:0, color: 'var(--text-muted)', fontSize:'0.9rem'}}>{n.message}</p>
                    <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'6px', fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600}}>
                        <Clock size={12}/> {new Date(n.created_at).toLocaleString()}
                    </div>
                </div>

                <ChevronRight size={20} style={{color: 'var(--border-light)'}} />
            </div>
         ))}
      </div>
    </div>
  );
}
