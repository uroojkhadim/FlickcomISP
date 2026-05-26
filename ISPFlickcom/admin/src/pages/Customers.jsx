import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Plus, X, PenLine, Trash2 } from 'lucide-react';

export default function Customers() {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [form, setForm] = useState({ name: '', cnic: '', phone: '', email: '', address: '', password: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', cnic: '', phone: '', email: '', address: '', password: '' });

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState(location.state?.search || '');

  const fetchCustomers = async () => {
    try {
       setLoading(true);
       const params = new URLSearchParams();
       if (filterStatus !== 'all') params.append('status', filterStatus);
       
       const trimmedSearch = searchQuery && typeof searchQuery === 'string' ? searchQuery.trim() : searchQuery;
       if (trimmedSearch) params.append('search', trimmedSearch);
       
       const res = await api.get(`/admin/customers?${params.toString()}`);
       setCustomers(res.data.data);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [filterStatus]);

  // Actions
  const handleApprove = async (id) => {
      try { await api.put(`/admin/customers/${id}/status`, { status: 'active' }); fetchCustomers(); } 
      catch (err) { alert('Failed to approve'); }
  };

  const handleSuspend = async (id) => {
      if(!window.confirm('Suspend this customer?')) return;
      try { await api.put(`/admin/customers/${id}/status`, { status: 'suspended' }); fetchCustomers(); } 
      catch (err) { alert('Failed to suspend'); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm('Are you sure you want to permanently delete this customer? This action cannot be undone.')) return;
      try { await api.delete(`/admin/customers/${id}`); fetchCustomers(); } 
      catch (err) { alert('Failed to delete customer'); }
  };

  const handleReject = (id) => {
      if(!window.confirm('Reject and delete this pending request?')) return;
      handleDelete(id); 
  };

  const handleEditClick = (c) => {
      // Load current customer data. Password kept explicitly blank.
      setEditForm({ 
          id: c.id, 
          name: c.name, 
          cnic: c.cnic || '', 
          phone: c.phone || '', 
          email: c.email || '', 
          address: c.address || '', 
          password: '' 
      });
      setShowEditModal(true);
  };

  // Submits
  const handleSubmitNewCustomer = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          await api.post('/admin/customers', form);
          setShowAddModal(false);
          setForm({ name: '', cnic: '', phone: '', email: '', address: '', password: '' });
          fetchCustomers();
      } catch (err) { alert('Error: ' + (err.response?.data?.error || err.message)); } 
      finally { setSubmitting(false); }
  }

  const handleUpdateCustomer = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          // Payload will map filled fields, including password if typed.
          await api.put(`/admin/customers/${editForm.id}`, editForm);
          setShowEditModal(false);
          fetchCustomers();
      } catch (err) { alert('Error: ' + (err.response?.data?.error || err.message)); } 
      finally { setSubmitting(false); }
  }

  return (
    <div>
      <div className="header">
        <div>
            <h1 className="page-title">Manage Customers</h1>
            <p className="page-subtitle">Fully manage user accounts, modifications and removals.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
             <Plus size={18} /> Add App User
        </button>
      </div>

      <div className="table-widget">
        <div className="table-header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Customer Directory</h2>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select 
                   className="auth-input" 
                   style={{ marginBottom: 0, padding: '0.4rem 1rem', width: 'auto', minWidth: '150px' }}
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Customers</option>
                    <option value="active">Active</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="suspended">Inactive / Suspended</option>
                </select>

                <div style={{ display: 'flex', gap: '5px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                        <label htmlFor="custSearch" className="sr-only" style={{display:'none'}}>Search Customers</label>
                        <input 
                            id="custSearch"
                            name="search"
                            className="auth-input" 
                            style={{ marginBottom: 0, padding: '0.4rem 1rem 0.4rem 2.2rem', width: '450px', maxWidth: '100%' }}
                            placeholder="Search by Name, Phone Number, CNIC, or Customer ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }} onClick={fetchCustomers}>Find</button>
                    {searchQuery && <button className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => { setSearchQuery(''); setTimeout(fetchCustomers, 100); }}>Clear</button>}
                </div>
            </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
            <table>
            <thead>
                <tr>
                <th>Customer ID</th>
                <th>Name / Email</th>
                <th>Phone / CNIC</th>
                <th>Status</th>
                <th>Account Controls</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="5" style={{textAlign:'center', padding: '2rem'}}><div className="spinner"></div></td></tr> : 
                 customers.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding: '2rem'}}>No customers found.</td></tr> :
                 customers.map(c => (
                <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{c.user_id}</td>
                    <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.email}</div>
                    </td>
                    <td>
                        <div style={{ fontWeight: 500 }}>{c.phone}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.cnic}</div>
                    </td>
                    <td><span className={`badge ${c.status}`}>{c.status.replace('_', ' ')}</span></td>
                    <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Primary state triggers */}
                            {c.status === 'pending_approval' && (
                                <button onClick={() => handleReject(c.id)} title="Reject Request" className="btn btn-outline btn-icon" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}><XCircle size={18} /></button>
                            )}

                            {(c.status === 'pending_approval' || c.status === 'suspended') && (
                                <button onClick={() => handleApprove(c.id)} title={c.status === 'suspended' ? "Reactivate Account" : "Approve Request"} className="btn btn-outline btn-icon" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}><CheckCircle size={18} /></button>
                            )}
                            
                            {c.status === 'active' && (
                                <button onClick={() => handleSuspend(c.id)} title="Suspend Account" className="btn btn-outline btn-icon" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}><XCircle size={18} /></button>
                            )}

                            {/* Full Control buttons */}
                            <button onClick={() => handleEditClick(c)} title="Edit Full Details" className="btn btn-outline btn-icon"><PenLine size={18} /></button>
                            <button onClick={() => handleDelete(c.id)} title="Delete Account Permanently" className="btn btn-outline btn-icon" style={{color: 'var(--danger)'}}><Trash2 size={18} /></button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* ── Modal: Edit Customer (FULL DETAILS) ── */}
      {showEditModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)'}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '500px', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Update Customer Data</h2>
                    <button onClick={() => setShowEditModal(false)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={24}/></button>
                </div>
                
                <form onSubmit={handleUpdateCustomer} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="editCustName" className="sr-only" style={{display:'none'}}>Full Name</label>
                        <input id="editCustName" name="name" className="auth-input" required placeholder="Full Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{marginBottom: 0}} autoComplete="name" />
                    </div>
                    <div>
                        <label htmlFor="editCustEmail" className="sr-only" style={{display:'none'}}>Email Address</label>
                        <input id="editCustEmail" name="email" className="auth-input" required type="email" placeholder="Email Address" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{marginBottom: 0}} autoComplete="email" />
                    </div>
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <div style={{flex: 1}}>
                            <label htmlFor="editCustPhone" className="sr-only" style={{display:'none'}}>Phone</label>
                            <input id="editCustPhone" name="phone" className="auth-input" required placeholder="Phone (+92...)" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{marginBottom: 0}} autoComplete="tel" />
                        </div>
                        <div style={{flex: 1}}>
                            <label htmlFor="editCustCnic" className="sr-only" style={{display:'none'}}>CNIC</label>
                            <input id="editCustCnic" name="cnic" className="auth-input" placeholder="CNIC" value={editForm.cnic} onChange={e => setEditForm({...editForm, cnic: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="editCustAddress" className="sr-only" style={{display:'none'}}>Address</label>
                        <input id="editCustAddress" name="address" className="auth-input" placeholder="Resident Address" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} style={{marginBottom: 0}} />
                    </div>
                    
                    <div style={{marginTop: '0.5rem'}}>
                        <label htmlFor="editCustPass" style={{fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600, display: 'block', marginBottom: '5px'}}>Password Reset (Optional)</label>
                        <input id="editCustPass" name="password" className="auth-input" type="password" placeholder="Leave blank to keep old password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} style={{marginBottom: 0, borderColor: 'var(--warning)'}} autoComplete="new-password" />
                    </div>
                    
                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
                        {submitting ? 'Updating...' : 'Save Full Changes'}
                    </button>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center'}}>Modifications bypass user approval queues automatically.</p>
                </form>
            </div>
        </div>
      )}

      {/* ── Modal: Add Customer ── */}
      {showAddModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)'}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '500px', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Register Customer</h2>
                    <button onClick={() => setShowAddModal(false)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmitNewCustomer} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="addCustName" className="sr-only" style={{display:'none'}}>Full Name</label>
                        <input id="addCustName" name="name" className="auth-input" required placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{marginBottom: 0}} autoComplete="name" />
                    </div>
                    <div>
                        <label htmlFor="addCustEmail" className="sr-only" style={{display:'none'}}>Email Address</label>
                        <input id="addCustEmail" name="email" className="auth-input" required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{marginBottom: 0}} autoComplete="email" />
                    </div>
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <div style={{flex: 1}}>
                            <label htmlFor="addCustPhone" className="sr-only" style={{display:'none'}}>Phone</label>
                            <input id="addCustPhone" name="phone" className="auth-input" required placeholder="Phone (+923...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{marginBottom: 0}} autoComplete="tel" />
                        </div>
                        <div style={{flex: 1}}>
                            <label htmlFor="addCustCnic" className="sr-only" style={{display:'none'}}>CNIC</label>
                            <input id="addCustCnic" name="cnic" className="auth-input" required placeholder="CNIC (12345-1234567-1)" value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="addCustAddress" className="sr-only" style={{display:'none'}}>Address</label>
                        <input id="addCustAddress" name="address" className="auth-input" required placeholder="Resident Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{marginBottom: 0}} />
                    </div>
                    <div>
                        <label htmlFor="addCustPass" className="sr-only" style={{display:'none'}}>Password</label>
                        <input id="addCustPass" name="password" className="auth-input" required type="password" placeholder="Passw@rd123" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{marginBottom: 0}} autoComplete="new-password" />
                    </div>
                    
                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
                        {submitting ? 'Registering...' : 'Create Active Account'}
                    </button>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center'}}>Customer will be active automatically.</p>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
