import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Plus, X, PenLine, Trash2, Power, PowerOff, Search } from 'lucide-react';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({ name: '', description: '', mb_limit: '', validity_days: '', price_pkr: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', mb_limit: '', validity_days: '', price_pkr: '' });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchQuery.trim().length > 0) params.append('search', searchQuery.trim());
      
      const res = await api.get(`/admin/packages?${params.toString()}`);
      setPackages(res.data.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/packages', form);
      setShowAddModal(false);
      setForm({ name: '', description: '', mb_limit: '', validity_days: '', price_pkr: '' });
      fetchPackages();
    } catch(err) {
      alert("Failed to create package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/packages/${editForm.id}`, {
          name: editForm.name,
          description: editForm.description,
          mb_limit: editForm.mb_limit,
          validity_days: editForm.validity_days,
          price_pkr: editForm.price_pkr,
      });
      setShowEditModal(false);
      fetchPackages();
    } catch(err) {
      alert("Failed to update package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this package permanently?')) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      fetchPackages();
    } catch(err) {
      alert("Failed to delete. It might be assigned to users.");
    }
  };

  const handleToggleState = async (id, currentStatus) => {
    if(!window.confirm(`Are you sure you want to turn this package ${currentStatus ? 'OFF (Inactive)' : 'ON (Active)'}?`)) return;
    try {
      await api.put(`/admin/packages/${id}`, { is_active: !currentStatus });
      fetchPackages();
    } catch(err) {
      alert("Failed to toggle status");
    }
  };

  const startEdit = (pkg) => {
      setEditForm({
          id: pkg.id,
          name: pkg.name,
          description: pkg.description || '',
          mb_limit: pkg.mb_limit,
          validity_days: pkg.validity_days,
          price_pkr: pkg.price_pkr
      });
      setShowEditModal(true);
  };

  return (
    <div>
      <div className="header">
        <div>
            <h1 className="page-title">Service Packages</h1>
            <p className="page-subtitle">Configure internet plans, data limits and pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
             <Plus size={18} /> New Package
        </button>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter:</span>
            <select 
                className="auth-input" 
                style={{ marginBottom: 0, padding: '0.4rem 1rem', width: 'auto', minWidth: '150px' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="all">All Packages</option>
                <option value="active">Only Active</option>
                <option value="inactive">Only Inactive</option>
            </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <label htmlFor="pkgSearch" className="sr-only" style={{display:'none'}}>Search Packages</label>
                <input 
                    id="pkgSearch"
                    name="search"
                    className="auth-input" 
                    style={{ marginBottom: 0, padding: '0.4rem 1rem 0.4rem 2.2rem', width: '650px', maxWidth: '100%' }}
                    placeholder="Search package name, price, or details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchPackages()}
                />
            </div>
            <button className="btn btn-primary" style={{ padding: '0.4rem 1.2rem' }} onClick={fetchPackages}>Search</button>
            {searchQuery && (
                <button className="btn btn-outline" style={{ padding: '0.4rem 1.2rem' }} onClick={() => { setSearchQuery(''); setTimeout(fetchPackages, 50); }}>Clear</button>
            )}
        </div>
      </div>

      <div className="dashboard-grid">
          {loading ? <div style={{gridColumn: '1/-1', textAlign: 'center'}}><div className="spinner"></div></div> : 
           packages.length === 0 ? <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem'}}><p>No packages found matching your criteria.</p></div> :
           packages.map((pkg, index) => {
              const bgColors = ['color-blue', 'color-emerald', 'color-purple', 'color-orange'];
              const themeClass = bgColors[index % bgColors.length];
              const isInactive = !pkg.is_active;
              
              return (
              <div key={pkg.id} className={`glass-card ${themeClass}`} style={isInactive ? { filter: 'grayscale(100%)', opacity: 0.7 } : {}}>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div className="stat-icon-wrapper colorful-icon-wrapper">
                          <Package size={24} />
                      </div>
                      <span style={{ fontSize: '0.8rem', background: isInactive ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                          {isInactive ? 'INACTIVE' : 'ACTIVE'}
                      </span>
                  </div>

                  <h3 style={{fontSize: '1.4rem', fontWeight: 700, margin: '0.5rem 0'}}>{pkg.name}</h3>
                  <p style={{marginBottom: '1.2rem', minHeight: '40px', opacity: 0.85}}>{pkg.description}</p>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.9}}>
                      <span style={{fontWeight: 600}}>Time Limit</span>
                      <span>{pkg.validity_days} Days</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.9}}>
                      <span style={{fontWeight: 600}}>Data Volume</span>
                      <span>{(pkg.mb_limit / 1024).toFixed(0)} GB</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                      <span style={{fontWeight: 600}}>Pricing</span>
                      <span style={{fontSize: '1.3rem', fontWeight: 700}}>Rs. {pkg.price_pkr}</span>
                  </div>

                  <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                      <button onClick={() => startEdit(pkg)} title="Edit Package Settings" className="btn" style={{flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}}>
                          <PenLine size={16} /> Edit
                      </button>
                      <button onClick={() => handleToggleState(pkg.id, pkg.is_active)} title={isInactive ? "Trun ON" : "Turn OFF"} className="btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0 0.8rem'}}>
                          {isInactive ? <Power size={18} /> : <PowerOff size={18} />}
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} title="Delete Bundle" className="btn" style={{background: 'rgba(200,30,30,0.6)', color: 'white', border: 'none', padding: '0 0.8rem'}}>
                          <Trash2 size={16} />
                      </button>
                  </div>
              </div>
          )})}
      </div>

      {/* ── Modal Add Package ── */}
      {showAddModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '400px', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Create Package</h2>
                    <button onClick={() => setShowAddModal(false)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="addPkgName" className="sr-only" style={{display:'none'}}>Package Name</label>
                        <input id="addPkgName" name="name" className="auth-input" required placeholder="Package Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>
                    <div>
                        <label htmlFor="addPkgDesc" className="sr-only" style={{display:'none'}}>Description</label>
                        <input id="addPkgDesc" name="description" className="auth-input" placeholder="Description (Optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <div style={{flex: 1}}>
                            <label htmlFor="addPkgData" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Data Limit (MB)</label>
                            <input id="addPkgData" name="mb_limit" type="number" className="auth-input" required placeholder="MBs" value={form.mb_limit} onChange={e => setForm({...form, mb_limit: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                        <div style={{flex: 1}}>
                            <label htmlFor="addPkgTime" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Time Limit (Days)</label>
                            <input id="addPkgTime" name="validity_days" type="number" className="auth-input" required placeholder="Days" value={form.validity_days} onChange={e => setForm({...form, validity_days: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="addPkgPrice" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Price (PKR)</label>
                        <input id="addPkgPrice" name="price" type="number" className="auth-input" required placeholder="Rs." value={form.price_pkr} onChange={e => setForm({...form, price_pkr: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
                        {submitting ? 'Creating...' : 'Launch Package'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* ── Modal Edit Package ── */}
      {showEditModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '400px', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Update Package</h2>
                    <button onClick={() => setShowEditModal(false)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={24}/></button>
                </div>
                <form onSubmit={handleUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="editPkgName" className="sr-only" style={{display:'none'}}>Package Name</label>
                        <input id="editPkgName" name="name" className="auth-input" required placeholder="Package Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>
                    <div>
                        <label htmlFor="editPkgDesc" className="sr-only" style={{display:'none'}}>Description</label>
                        <input id="editPkgDesc" name="description" className="auth-input" placeholder="Description" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <div style={{flex: 1}}>
                            <label htmlFor="editPkgData" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Data Limit (MB)</label>
                            <input id="editPkgData" name="mb_limit" type="number" className="auth-input" required value={editForm.mb_limit} onChange={e => setEditForm({...editForm, mb_limit: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                        <div style={{flex: 1}}>
                            <label htmlFor="editPkgTime" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Time Limit (Days)</label>
                            <input id="editPkgTime" name="validity_days" type="number" className="auth-input" required value={editForm.validity_days} onChange={e => setEditForm({...editForm, validity_days: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="editPkgPrice" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Price (PKR)</label>
                        <input id="editPkgPrice" name="price" type="number" className="auth-input" required value={editForm.price_pkr} onChange={e => setEditForm({...editForm, price_pkr: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
                        {submitting ? 'Updating...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
