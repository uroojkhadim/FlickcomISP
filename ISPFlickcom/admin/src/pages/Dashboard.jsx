import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, AlertTriangle, FileText, Activity, UserX, UserPlus, PackageSearch, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        setError("Failed to stream live stats. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>;

  if (error) return (
      <div className="glass-card" style={{borderColor: 'var(--danger)'}}>
          <h3 style={{color: 'var(--danger)', marginBottom: '1rem'}}>Connection Error</h3>
          <p>{error}</p>
      </div>
  );

  return (
    <div>
      <div className="header">
        <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Real-time statistics and analytics from the ISP Platform.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        
        {/* Helper function to standardize card style inline to make them compact */}
        {(() => {
          const cardStyle = { padding: '1.2rem', minHeight: '110px' };
          const iconSize = 20;
          const valStyle = { fontSize: '1.6rem', fontWeight: 700, margin: '0.3rem 0' };
          const titleStyle = { fontSize: '0.85rem', opacity: 0.9, margin: 0, fontWeight: 500 };

          return (
            <>
              <div className="glass-card color-blue" style={cardStyle}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><Users size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.total_customers}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Total Customers</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><CheckCircle2 size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.active_customers}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Active Customers</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(220, 38, 38, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><UserX size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.inactive_customers}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Inactive / Suspended</h3>
              </div>

              <div className="glass-card color-orange" style={cardStyle}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><UserPlus size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.new_connections}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>New Connections</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(217, 119, 6, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><Activity size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.pending_approvals}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Pending Approvals</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #be123c 0%, #881337 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(190, 18, 60, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><AlertTriangle size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.active_complaints}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Open Complaints</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #0284c7 0%, #075985 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(2, 132, 199, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><CreditCard size={iconSize} /></div>
                <p className="colorful-stat-text" style={valStyle}>{stats?.pending_payments}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Pending Bills</h3>
              </div>

              <div className="glass-card" style={{ ...cardStyle, background: 'linear-gradient(135deg, #65a30d 0%, #3f6212 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px -5px rgba(101, 163, 13, 0.4)' }}>
                <div className="stat-icon-wrapper colorful-icon-wrapper" style={{width: 38, height: 38}}><Banknote size={iconSize} /></div>
                <p className="colorful-stat-text" style={{...valStyle, fontSize: '1.2rem'}}>Rs. {stats?.total_overdue?.toLocaleString()}</p>
                <h3 className="colorful-stat-text" style={titleStyle}>Total Overdue Cash</h3>
              </div>
            </>
          );
        })()}
      </div>
      
      {/* ── Charts Grid ── */}
      <div className="chart-grid">
          {/* Revenue Chart */}
          <div className="table-widget">
             <div className="table-header-action">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Monthly Revenue Trend (PKR)</h2>
             </div>
             <div style={{ width: '100%', height: 350, minWidth: 0 }}>
                <ResponsiveContainer>
                    <AreaChart data={stats?.revenue_chart || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs ${val/1000}k`} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Complaints Chart */}
          <div className="table-widget">
             <div className="table-header-action">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Weekly Helpdesk Metrics</h2>
             </div>
             <div style={{ width: '100%', height: 350, minWidth: 0 }}>
                <ResponsiveContainer>
                    <BarChart data={stats?.complaint_chart || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="day" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}} />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                        <Bar dataKey="open" name="Opened" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>

    </div>
  );
}
