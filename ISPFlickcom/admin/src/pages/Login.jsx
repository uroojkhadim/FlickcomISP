import React, { useState } from 'react';
import api from '../api/axios';
import { Activity } from 'lucide-react';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 1. API Call
      const res = await api.post('/auth/login', { email, password });

      console.log("Login Response:", res.data); // Debugging ke liye console check karein

      // 2. Role Check (Check karein ke user object exist karta hai)
      const user = res.data.user;
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        setError('Unauthorized: Sirf Admins login kar sakte hain.');
        setLoading(false);
        return;
      }

      // 3. Token Handle (Check karein ke token kahan mil raha hai)
      // Agar res.data.tokens.accessToken nahi hai, toh res.data.token check karein
      const token = res.data.tokens?.accessToken || res.data.token;

      if (!token) {
        setError('Server se token nahi mila. Backend check karein.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', token);
      setToken(token);

    } catch (err) {
      console.error("Login Error:", err);
      // Backend se aane wala specific error message dikhayen
      const message = err.response?.data?.message || err.response?.data?.error || 'Login nakam raha. Connection check karein.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Baaki UI code wahi rahega)
  return (
    <div className="auth-container">
      {/* UI Code same as before */}
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Admin Portal</h1>
          <p>Sign in to manage ISP Platform</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            required
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Admin Email"
          />
          <input
            type="password"
            required
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Loading...' : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}