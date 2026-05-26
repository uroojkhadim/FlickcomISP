import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  User, Mail, Phone, Camera, Shield, Save, Check, Key,
  Eye, EyeOff, AlertTriangle, Clock, Globe, Bell,
  Activity, Edit3, Lock, Loader, ChevronRight, LogOut
} from 'lucide-react';

// ─── Helper: initials ─────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AD';

// ─── InfoItem Component ────────────────────────────────────
const InfoItem = ({ icon: Icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 18px', background: '#f8fafc',
    borderRadius: '14px', border: '1.5px solid #e8edf8'
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: '11px',
      background: '#eff6ff', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, color: '#2563eb'
    }}>
      <Icon size={17} />
    </div>
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{value || '—'}</p>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────
const SectionCard = ({ title, subtitle, icon: Icon, children, accent = '#3b82f6' }) => (
  <div style={{
    background: 'white', borderRadius: '20px',
    border: '1.5px solid #e8edf8',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'linear-gradient(135deg, #fafbff, white)'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '12px',
        background: `${accent}18`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: accent
      }}>
        <Icon size={18} />
      </div>
      <div>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ padding: '24px' }}>
      {children}
    </div>
  </div>
);

// ─── Input Field ─────────────────────────────────────────
const InputField = ({ label, id, type = 'text', value, onChange, readOnly = false, placeholder, required, suffix, helper }) => (
  <div>
    <label htmlFor={id} style={{
      display: 'block', fontSize: '0.75rem', fontWeight: 700,
      color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px'
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        autoComplete={id}
        style={{
          width: '100%', padding: '11px 14px',
          paddingRight: suffix ? '48px' : '14px',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: readOnly ? '#94a3b8' : '#0f172a',
          background: readOnly ? '#f8fafc' : 'white',
          outline: 'none',
          transition: 'all 0.2s',
          fontFamily: 'Outfit, sans-serif',
        }}
        onFocus={e => { if (!readOnly) { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}}
        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
      />
      {suffix && (
        <div style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)', color: '#94a3b8'
        }}>
          {suffix}
        </div>
      )}
    </div>
    {helper && <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px' }}>{helper}</p>}
  </div>
);

// ─── Toast ────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div style={{
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '14px 20px', borderRadius: '14px',
    background: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white', fontWeight: 600, fontSize: '0.875rem',
    display: 'flex', alignItems: 'center', gap: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    zIndex: 9999, animation: 'slideUp 0.3s ease-out',
  }}>
    {type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
    {message}
  </div>
);

// ═══════════════════════════════════════════════════════════
// Main Profile Component
// ═══════════════════════════════════════════════════════════
export default function Profile() {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', avatar_url: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile | security | activity
  const [toast, setToast] = useState(null);

  // Password change state
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/admin/profile');
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      console.error('Profile load failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/profile', { name: profile.name, phone: profile.phone, avatar_url: profile.avatar_url });
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Update failed. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = () => {
    const url = prompt('Paste your profile image URL:', profile.avatar_url || '');
    if (url !== null) setProfile(p => ({ ...p, avatar_url: url }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (pwForm.new.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    setPwSaving(true);
    try {
      await api.put('/admin/settings/password', { currentPassword: pwForm.current, newPassword: pwForm.new });
      setPwForm({ current: '', new: '', confirm: '' });
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Password change failed.', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  // Recent activity mock (badge + readable)
  const activities = [
    { icon: '🔐', text: 'Password changed', time: '2 days ago' },
    { icon: '✅', text: 'Customer CUST00023 approved', time: '3 days ago' },
    { icon: '📋', text: 'Generated 12 bills', time: '5 days ago' },
    { icon: '📋', text: 'Complaint #TKT-0041 resolved', time: '1 week ago' },
    { icon: '👤', text: 'Profile updated', time: '2 weeks ago' },
  ];

  if (loading) return (
    <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
      <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} /> Loading profile...
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-page { animation: fadeIn 0.35s ease-out; }
        .profile-tab-btn {
          padding: 9px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #64748b;
        }
        .profile-tab-btn.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }
        .profile-tab-btn:hover:not(.active) {
          background: #f8fafc;
          color: #0f172a;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .form-grid-2 { grid-template-columns: 1fr; }
        }
        .save-btn {
          padding: 11px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pw-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: #94a3b8; cursor: pointer;
          padding: 4px; display: flex;
          align-items: center;
        }
        .pw-eye-btn:hover { color: #2563eb; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="profile-page">

        {/* ── Page Header ── */}
        <div className="header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your account information and security settings</p>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', background: 'white', padding: '8px', borderRadius: '16px', border: '1.5px solid #e8edf8', width: 'fit-content' }}>
          {[
            { key: 'profile', label: 'Profile Info', icon: User },
            { key: 'security', label: 'Password & Security', icon: Lock },
            { key: 'activity', label: 'Recent Activity', icon: Activity },
          ].map(tab => (
            <button
              key={tab.key}
              className={`profile-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ════ TAB: PROFILE INFO ════ */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* ── Left: Avatar + Info Card ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Avatar */}
              <div style={{
                background: 'white', borderRadius: '20px',
                border: '1.5px solid #e8edf8', padding: '32px 24px',
                textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                {/* Avatar circle */}
                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px' }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 800, color: 'white',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    overflow: 'hidden', border: '4px solid white',
                  }}>
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : getInitials(profile.name)
                    }
                  </div>
                  <button
                    onClick={handleAvatarChange}
                    title="Change photo"
                    style={{
                      position: 'absolute', bottom: 4, right: 4,
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'white', border: '2.5px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#2563eb',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                  >
                    <Camera size={15} />
                  </button>
                </div>

                <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '4px' }}>{profile.name}</h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>{profile.email}</p>

                {/* Role badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  borderRadius: '12px', border: '1.5px solid #bfdbfe',
                }}>
                  <Shield size={16} style={{ color: '#2563eb' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8' }}>
                    {profile.role === 'superadmin' ? 'Super Admin' : profile.role || 'Administrator'}
                  </span>
                </div>
              </div>

              {/* Account Details */}
              <SectionCard title="Account Details" icon={Globe} subtitle="Read-only info">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <InfoItem icon={Mail} label="Email" value={profile.email} />
                  <InfoItem icon={Shield} label="Role" value={profile.role === 'superadmin' ? 'Super Admin' : profile.role} />
                  <InfoItem icon={Clock} label="Member Since" value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} />
                </div>
              </SectionCard>
            </div>

            {/* ── Right: Edit Form ── */}
            <SectionCard title="Edit Profile" subtitle="Update your personal information" icon={Edit3}>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-grid-2">
                    <InputField
                      label="Full Name"
                      id="name"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                    <InputField
                      label="Phone Number"
                      id="phone"
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+92 300 0000000"
                    />
                  </div>
                  <InputField
                    label="Email Address (Login) — Read Only"
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly={true}
                    helper="Email cannot be changed for security reasons."
                  />
                  <InputField
                    label="Profile Picture URL"
                    id="avatar_url"
                    value={profile.avatar_url}
                    onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))}
                    placeholder="https://..."
                    helper="Paste a direct image URL or use the camera icon above."
                  />

                  {/* Preview avatar if URL entered */}
                  {profile.avatar_url && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                      <img
                        src={profile.avatar_url}
                        alt="Preview"
                        style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>Avatar Preview</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>This will be shown across the panel.</p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving
                        ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                        : <><Save size={16} /> Save Changes</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </SectionCard>
          </div>
        )}

        {/* ════ TAB: SECURITY ════ */}
        {activeTab === 'security' && (
          <div style={{ maxWidth: 620 }}>
            <SectionCard title="Change Password" subtitle="Use a strong password you don't use elsewhere" icon={Key} accent="#8b5cf6">
              <form onSubmit={handlePasswordChange}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Current Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px' }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw.current ? 'text' : 'password'}
                        value={pwForm.current}
                        onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                        required
                        placeholder="Enter current password"
                        style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                        onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" className="pw-eye-btn" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}>
                        {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw.new ? 'text' : 'password'}
                        value={pwForm.new}
                        onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))}
                        required
                        placeholder="Enter new password (min 8 chars)"
                        style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
                        onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" className="pw-eye-btn" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}>
                        {showPw.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {pwForm.new && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} style={{
                              flex: 1, height: 4, borderRadius: 2,
                              background: pwForm.new.length >= i * 3
                                ? (pwForm.new.length >= 12 ? '#10b981' : pwForm.new.length >= 8 ? '#f59e0b' : '#ef4444')
                                : '#e2e8f0',
                              transition: 'all 0.3s'
                            }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                          Strength: {pwForm.new.length >= 12 ? '💪 Strong' : pwForm.new.length >= 8 ? '🟡 Medium' : '🔴 Weak'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw.confirm ? 'text' : 'password'}
                        value={pwForm.confirm}
                        onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                        required
                        placeholder="Re-enter new password"
                        style={{
                          width: '100%', padding: '11px 44px 11px 14px',
                          border: `1.5px solid ${pwForm.confirm && pwForm.confirm !== pwForm.new ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '12px', fontSize: '0.9rem', outline: 'none',
                          fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s'
                        }}
                        onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = (pwForm.confirm && pwForm.confirm !== pwForm.new) ? '#ef4444' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" className="pw-eye-btn" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}>
                        {showPw.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwForm.confirm && pwForm.confirm !== pwForm.new && (
                      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> Passwords do not match
                      </p>
                    )}
                    {pwForm.confirm && pwForm.confirm === pwForm.new && (
                      <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Security Tips */}
                  <div style={{
                    padding: '14px', background: '#fffbeb',
                    border: '1.5px solid #fef3c7', borderRadius: '12px'
                  }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> Password Security Tips
                    </p>
                    <ul style={{ fontSize: '0.78rem', color: '#78350f', paddingLeft: '16px', margin: 0, lineHeight: '1.8' }}>
                      <li>Use at least 8 characters</li>
                      <li>Mix uppercase, lowercase, numbers & symbols</li>
                      <li>Never reuse passwords from other sites</li>
                    </ul>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={pwSaving}
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                    >
                      {pwSaving
                        ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
                        : <><Key size={16} /> Update Password</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </SectionCard>
          </div>
        )}

        {/* ════ TAB: ACTIVITY ════ */}
        {activeTab === 'activity' && (
          <div style={{ maxWidth: 580 }}>
            <SectionCard title="Recent Activity" subtitle="Your last 5 actions on the platform" icon={Activity} accent="#10b981">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activities.map((act, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px',
                      background: i % 2 === 0 ? '#fafbff' : 'white',
                      borderRadius: '14px',
                      border: '1.5px solid #e8edf8',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{act.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>{act.text}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={11} /> {act.time}
                      </p>
                    </div>
                    <ChevronRight size={15} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', fontSize: '0.8rem', color: '#166534', textAlign: 'center', fontWeight: 500 }}>
                ✅ Full audit logs will be available in Phase 2
              </div>
            </SectionCard>
          </div>
        )}

      </div>
    </>
  );
}
