import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';
import { Search, PenLine, Eye, X, MessageSquare } from 'lucide-react';

export default function Complaints() {
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState(location.state?.search || '');

  const fetchComplaints = async () => {
    try {
       setLoading(true);
       const params = new URLSearchParams();
       if (filterStatus !== 'all') params.append('status', filterStatus);
       if (filterPriority !== 'all') params.append('priority', filterPriority);
       
       const trimmedSearch = searchQuery && typeof searchQuery === 'string' ? searchQuery.trim() : searchQuery;
       if (trimmedSearch) params.append('search', trimmedSearch);
       
       const res = await api.get(`/admin/complaints?${params.toString()}`);
       setComplaints(res.data.data);

       // Auto-open if we came from notification
       if (location.state?.search && res.data.data.length === 1) {
           setSelectedComplaint(res.data.data[0]);
       }
    } catch (err) {
       console.error("Failed to fetch complaints", err);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filterStatus, filterPriority]);

  const handleResolve = async (id) => {
    try {
        const notes = prompt("Enter resolution notes (optional):");
        if (notes === null) return; 
        await api.put(`/admin/complaints/${id}`, { status: 'resolved', resolution_notes: notes });
        setSelectedComplaint(null);
        fetchComplaints();
    } catch(err) {
        alert("Failed to resolve complaint");
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
        await api.put(`/admin/complaints/${id}`, { status: newStatus });
        if(selectedComplaint && selectedComplaint.id === id) {
            setSelectedComplaint({...selectedComplaint, status: newStatus});
        }
        fetchComplaints();
    } catch(err) {
        alert("Failed to update status");
    }
  }

  const handleUpdatePriority = async (id, newPriority) => {
    try {
        await api.put(`/admin/complaints/${id}`, { priority: newPriority });
        if(selectedComplaint && selectedComplaint.id === id) {
            setSelectedComplaint({...selectedComplaint, priority: newPriority});
        }
        fetchComplaints();
    } catch(err) {
        alert("Failed to update priority");
    }
  }

  return (
    <div>
      <div className="header">
        <div>
            <h1 className="page-title">Helpdesk Support</h1>
            <p className="page-subtitle">Track, investigate and resolve customer technical issues.</p>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{display:'flex', flexDirection:'column', gap: '4px'}}>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)'}}>STATUS</label>
               <select 
                   className="auth-input" 
                   style={{ marginBottom: 0, padding: '0.4rem 1rem', width: 'auto', minWidth: '140px' }}
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
               >
                   <option value="all">All States</option>
                   <option value="open">Open</option>
                   <option value="in_progress">In Progress</option>
                   <option value="resolved">Resolved</option>
                   <option value="closed">Closed</option>
               </select>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap: '4px'}}>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)'}}>PRIORITY</label>
               <select 
                   className="auth-input" 
                   style={{ marginBottom: 0, padding: '0.4rem 1rem', width: 'auto', minWidth: '140px' }}
                   value={filterPriority}
                   onChange={(e) => setFilterPriority(e.target.value)}
               >
                   <option value="all">Any Priority</option>
                   <option value="low">Low</option>
                   <option value="medium">Medium</option>
                   <option value="high">High</option>
                   <option value="critical">Critical</option>
               </select>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <label htmlFor="complaintSearch" className="sr-only" style={{display:'none'}}>Search Complaints</label>
                <input 
                    id="complaintSearch"
                    name="search"
                    className="auth-input" 
                    style={{ marginBottom: 0, padding: '0.4rem 1rem 0.4rem 2.2rem', width: '650px', maxWidth: '100%' }}
                    placeholder="Search Ticket #, Title, or Customer Issue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
                    autoComplete="off"
                />
            </div>
            <button className="btn btn-primary" style={{ padding: '0.4rem 1.5rem' }} onClick={fetchComplaints}>Find</button>
            {searchQuery && (
                <button className="btn btn-outline" style={{ padding: '0.4rem 1.2rem' }} onClick={() => { setSearchQuery(''); setTimeout(fetchComplaints, 50); }}>Clear</button>
            )}
        </div>
      </div>

      <div className="table-widget">
        <div style={{ overflowX: 'auto' }}>
            <table>
            <thead>
                <tr>
                <th>Ticket ID</th>
                <th>Priority</th>
                <th>Issue Summary</th>
                <th>Customer Name</th>
                <th>Status Control</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="6" style={{textAlign:'center', padding: '2rem'}}><div className="spinner"></div></td></tr> : 
                 complaints.length === 0 ? <tr><td colSpan="6" style={{textAlign:'center', padding: '2rem'}}>No complaints found matching filters.</td></tr> :
                 complaints.map(c => (
                <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.ticket_number}</td>
                    <td>
                        <select 
                            value={c.priority} 
                            onChange={(e) => handleUpdatePriority(c.id, e.target.value)}
                            className={`badge ${c.priority}`}
                            style={{ border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </td>
                    <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cat: {c.category.toUpperCase()}</div>
                    </td>
                    <td>{c.user?.name || 'Unknown'}</td>
                    <td>
                        <select 
                            value={c.status}
                            onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                            className={`badge ${c.status}`}
                            style={{ border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </td>
                    <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setSelectedComplaint(c)} title="Read Full Complaint" className="btn btn-outline btn-icon" style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}><Eye size={18} /></button>
                            
                            {c.status !== 'resolved' && c.status !== 'closed' && (
                                <button onClick={() => handleResolve(c.id)} title="Finalize Resolution" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><PenLine size={14} /> Resolve</button>
                            )}
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* ── View Full Complaint Modal ── */}
      {selectedComplaint && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(5px)'}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '650px', background: 'white', padding: '2.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem'}}>
                    <div>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Ticket: {selectedComplaint.ticket_number}</h2>
                        <div style={{display:'flex', gap:'10px', alignItems:'center', marginTop:'0.8rem'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <span style={{fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)'}}>PRIORITY:</span>
                                <select 
                                    value={selectedComplaint.priority}
                                    onChange={(e) => handleUpdatePriority(selectedComplaint.id, e.target.value)}
                                    className={`badge ${selectedComplaint.priority}`}
                                    style={{border:'none', borderRadius:'12px', fontWeight:600}}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                               <span style={{fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)'}}>STATUS:</span>
                               <select 
                                    value={selectedComplaint.status}
                                    onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value)}
                                    className={`badge ${selectedComplaint.status}`}
                                    style={{border:'none', borderRadius:'12px', fontWeight:600}}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedComplaint(null)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={26}/></button>
                </div>
                
                <div style={{marginBottom: '1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                    <div style={{background: '#f8fafc', padding:'1rem', borderRadius:'12px'}}>
                        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom:'5px'}}>Customer</p>
                        <p style={{fontWeight: 700, fontSize: '1.1rem', margin:0}}>{selectedComplaint.user?.name}</p>
                        <p style={{color: 'var(--text-main)', margin:0}}>ID: {selectedComplaint.user?.user_id}</p>
                        <p style={{color: 'var(--text-main)', margin:0}}>Mob: {selectedComplaint.user?.phone}</p>
                    </div>
                    <div style={{background: '#f8fafc', padding:'1rem', borderRadius:'12px'}}>
                        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom:'5px'}}>Logging Info</p>
                        <p style={{fontWeight: 600, margin:0}}>Created: {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                        <p style={{color: 'var(--text-muted)', margin:0}}>{new Date(selectedComplaint.created_at).toLocaleTimeString()}</p>
                        <p style={{color: 'var(--primary-600)', fontWeight: 600, margin:0}}>Cat: {selectedComplaint.category.toUpperCase()}</p>
                    </div>
                </div>

                <div style={{marginBottom: '2.5rem', background: 'var(--primary-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary-100)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom: '0.5rem'}}>
                        <MessageSquare size={16} className="text-primary-600" />
                        <p style={{fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 700, textTransform: 'uppercase', margin:0}}>Issue Description</p>
                    </div>
                    <h3 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b'}}>{selectedComplaint.title}</h3>
                    <p style={{color: '#334155', lineHeight: '1.6', fontSize: '1rem'}}>{selectedComplaint.message}</p>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                    <button onClick={() => setSelectedComplaint(null)} className="btn btn-outline">Close View</button>
                    {selectedComplaint.status !== 'resolved' && (
                        <button onClick={() => handleResolve(selectedComplaint.id)} className="btn btn-primary" style={{padding:'0.8rem 2rem'}}><PenLine size={18} /> Resolve & Close Ticket</button>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
