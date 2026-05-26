import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Ticket, 
  Download, 
  Calendar,
  Activity,
  Zap,
  Target,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // Default 30 days
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reports?days=${timeRange}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFontSize(18);
      pdf.text('ISP Service Platform - Executive Report', 15, 15);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()} | Period: Last ${timeRange} Days`, 15, 22);
      
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
      pdf.save(`ISP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Export Failed", err);
      alert("Failed to generate PDF. Please check console.");
    } finally {
      setIsExporting(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading && !data) return (
    <div style={{height: '80vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div className="spinner"></div>
    </div>
  );

  const revenueChartData = data ? Object.entries(data.revenue).map(([name, value]) => ({ name, value })) : [];
  const complaintChartData = data ? Object.entries(data.complaints).map(([name, value]) => ({ name, value })) : [];
  
  const totalRevenue = data ? Object.values(data.revenue).reduce((a,b)=>a+b, 0) : 0;
  const totalTickets = data ? Object.values(data.complaints).reduce((a,b)=>a+b, 0) : 0;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div className="header">
        <div>
          <h1 className="page-title">Executive Analytics</h1>
          <p className="page-subtitle">Performance tracking and business intelligence for the last {timeRange} days.</p>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
            <div style={{position:'relative'}}>
                <select 
                    className="btn btn-outline" 
                    style={{paddingRight: '2.5rem', appearance: 'none', cursor:'pointer'}}
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                    <option value="365">All Time</option>
                </select>
                <ChevronDown size={16} style={{position:'absolute', right:'12px', top:'15px', pointerEvents:'none'}} />
            </div>
            
            <button className="btn btn-primary" onClick={handleExportPDF} disabled={isExporting}>
                {isExporting ? 'Generating...' : <><Download size={18} /> Export PDF Report</>}
            </button>
        </div>
      </div>

      <div ref={reportRef} style={{padding: isExporting ? '20px' : '0'}}>
        {/* ── KPI Summary Cards ── */}
        <div className="dashboard-grid" style={{marginBottom: '2.5rem'}}>
            <ReportKpiCard 
                title="Revenue Collected" 
                value={`Rs. ${totalRevenue.toLocaleString()}`} 
                growth="+18.5%" 
                icon={<DollarSign size={24}/>} 
                theme="color-blue" 
            />
            <ReportKpiCard 
                title="Active Subscribers" 
                value={data?.customers.active || 0} 
                growth={`+${data?.customers.new_this_period || 0} new`} 
                icon={<Users size={24}/>} 
                theme="color-emerald" 
            />
            <ReportKpiCard 
                title="Support Load" 
                value={totalTickets} 
                growth={totalTickets > 10 ? "Heavy" : "Normal"} 
                icon={<Ticket size={24}/>} 
                theme="color-orange" 
            />
            <ReportKpiCard 
                title="Service Integrity" 
                value="99.9%" 
                growth="Stable" 
                icon={<ShieldCheck size={24}/>} 
                theme="color-purple" 
            />
        </div>

        <div className="chart-grid">
            <div className="glass-card" style={{gridColumn: 'span 2', padding: '2.5rem', minHeight: '450px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2.5rem'}}>
                    <div>
                    <h3 style={{fontWeight:800, fontSize:'1.5rem', color: '#1e293b'}}>Revenue Trends</h3>
                    <p style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>Income breakdown over the selected period.</p>
                    </div>
                </div>
                <div style={{width: '100%', height: 350, minWidth: 0}}>
                    <ResponsiveContainer>
                    <AreaChart data={revenueChartData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="dashboard-grid" style={{marginTop:'1.5rem'}}>
            <div className="glass-card" style={{padding: '2rem'}}>
                <h3 style={{fontWeight:800, fontSize:'1.2rem', marginBottom: '1.5rem'}}>Ticket Distribution</h3>
                <div style={{width: '100%', height: 300, minWidth: 0}}>
                    <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={complaintChartData}
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {complaintChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card" style={{padding: '2rem'}}>
                <h3 style={{fontWeight:800, fontSize:'1.2rem', marginBottom: '1.5rem'}}>Account Breakdown</h3>
                <div style={{width: '100%', height: 300, minWidth: 0}}>
                    <ResponsiveContainer>
                    <BarChart data={[
                        { name: 'Active', val: data?.customers.active },
                        { name: 'Suspended', val: data?.customers.suspended },
                        { name: 'New', val: data?.customers.new_this_period }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight:600, fontSize: 10}} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="val" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40}>
                            { [0,1,2].map((i) => <Cell key={i} fill={i===0?'#10b981':i===1?'#ef4444':'#f59e0b'} />) }
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card" style={{padding: '2rem', display:'flex', flexDirection:'column', background: '#1e293b', color:'white', border:'none'}}>
                <h3 style={{fontWeight:800, fontSize:'1.2rem', marginBottom: '1.5rem'}}>Operational IQ</h3>
                <div style={{flex: 1, display:'flex', flexDirection:'column', gap:'1.2rem'}}>
                    <IQRow icon={<Zap size={18}/>} title="Peak Speed" value="94 Mbps" color="#f59e0b" />
                    <IQRow icon={<Target size={18}/>} title="SLA Success" value="98.8%" color="#10b981" />
                    <IQRow icon={<Users size={18}/>} title="Churn Rate" value="2.1%" color="#ef4444" />
                    
                    <div style={{marginTop:'auto', padding:'1rem', background:'rgba(255,255,255,0.1)', borderRadius:'12px', textAlign:'center', border:'1px solid rgba(255,255,255,0.1)'}}>
                        <p style={{fontSize:'0.7rem', opacity:0.6, letterSpacing:'1px', marginBottom:'4px'}}>GLOBAL STATUS</p>
                        <p style={{fontSize:'1rem', fontWeight:800, margin:0}}>ALL SYSTEMS GO</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function ReportKpiCard({ title, value, growth, icon, theme }) {
    return (
        <div className={`glass-card ${theme}`} style={{padding: '1.5rem', overflow:'visible'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div className="colorful-icon-wrapper" style={{width:'46px', height:'46px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {icon}
                </div>
                <span style={{fontSize:'0.75rem', fontWeight:800, color: 'white', background: 'rgba(255,255,255,0.2)', padding:'4px 8px', borderRadius:'12px'}}>
                    {growth}
                </span>
            </div>
            <div style={{marginTop:'1.2rem'}}>
                <p className="colorful-stat-text" style={{fontSize:'0.85rem', fontWeight:600, marginBottom: '2px', opacity: 0.8}}>{title}</p>
                <h2 className="colorful-stat-text" style={{fontSize:'1.8rem', fontWeight:800, margin:0}}>{value}</h2>
            </div>
        </div>
    );
}

function IQRow({ icon, title, value, color }) {
    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{color: color}}>{icon}</div>
                <span style={{fontSize:'0.9rem', fontWeight:600}}>{title}</span>
            </div>
            <span style={{fontSize:'0.95rem', fontWeight:800}}>{value}</span>
        </div>
    );
}
