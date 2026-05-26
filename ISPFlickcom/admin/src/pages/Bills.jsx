import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, DollarSign, X } from 'lucide-react';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ user_id: '', amount: '', due_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Let's implement fetching raw bills from a public-like admin approach, 
      // since the specific GET /admin/bills hasn't been coded backend-wise, 
      // I'll simulate or fetch customer base for the modal.
      const custRes = await api.get('/admin/customers');
      setCustomers(custRes.data.data.filter(c => c.status === 'active'));
      
      // Wait we don't have GET /admin/bills. I'll mock list display for now to show table logic, 
      // but generate API works!
      setBills([
          // Just empty initially, this represents standard behavior if no endpoint exists
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          await api.post('/admin/bills/generate', {
              user_ids: [form.user_id],  // Our endpoint takes array of user IDs for bulk capability
              amount: parseFloat(form.amount),
              due_date: new Date(form.due_date).toISOString()
          });
          alert('Bill Generated Successfully!');
          setShowModal(false);
      } catch (err) {
          alert('Failed: ' + (err.response?.data?.error || err.message));
      } finally {
          setSubmitting(false);
      }
  };

  return (
    <div>
      <div className="header">
        <div>
            <h1 className="page-title">Billing & Revenue</h1>
            <p className="page-subtitle">Send unified invoices directly to user accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <DollarSign size={18} /> Generate Invoice
        </button>
      </div>

      <div className="table-widget">
        <div className="table-header-action">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Invoice Generation Log</h2>
        </div>
        
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Advance billing management system loaded.</p>
            <p>Generate an invoice from top right to instantly ping the Customer App bill section!</p>
        </div>
      </div>

      {/* ── Modal Generate Bill ── */}
      {showModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)'}}>
            <div className="glass-card" style={{width: '100%', maxWidth: '400px', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Create Invoice</h2>
                    <button onClick={() => setShowModal(false)} style={{background: 'transparent', border:'none', cursor:'pointer'}}><X size={24}/></button>
                </div>
                <form onSubmit={handleGenerate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="billUser" className="sr-only" style={{display:'none'}}>Select Customer</label>
                        <select id="billUser" name="user_id" required className="auth-input" style={{marginBottom: 0}} value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} autoComplete="off">
                            <option value="">Select Customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.user_id})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="billAmount" className="sr-only" style={{display:'none'}}>Amount</label>
                        <input id="billAmount" name="amount" required type="number" className="auth-input" placeholder="Amount (e.g. 2500)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>
                    
                    <div style={{marginBottom: '0.5rem'}}>
                        <label htmlFor="billDueDate" style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block'}}>Due Date</label>
                        <input id="billDueDate" name="due_date" required type="date" className="auth-input" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} style={{marginBottom: 0}} autoComplete="off" />
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
                        {submitting ? 'Generating...' : 'Send Invoice to Customer App'}
                    </button>
                    
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
