import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  User, Mail, Phone, Camera, Shield, Save, 
  Check, Lock, Bell, Settings as SettingsIcon, Globe,
  ShieldCheck, Eye, EyeOff, LayoutTemplate, Palette, 
  Zap, MailCheck, BellRing, Smartphone, Briefcase, 
  Coins, Megaphone
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Security States
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  // Advanced Settings (Mock states for UI demo)
  const [alerts, setAlerts] = useState({ email: true, push: true, weekly: false, complaints: true });
  const [system, setSystem] = useState({ company: 'ISPFlick Broadband', currency: 'PKR', supportNum: '0300-1234567', tax: '0' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/profile');
      if (res.data.data) {
          setProfile({
              name: res.data.data.name || '',
              phone: res.data.data.phone || '',
              email: res.data.data.email || '',
              avatar_url: res.data.data.avatar_url || ''
          });
      }
    } catch (err) {
      console.error("Profile load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400;
              const MAX_HEIGHT = 400;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                  if (width > MAX_WIDTH) {
                      height *= MAX_WIDTH / width;
                      width = MAX_WIDTH;
                  }
              } else {
                  if (height > MAX_HEIGHT) {
                      width *= MAX_HEIGHT / height;
                      height = MAX_HEIGHT;
                  }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              // Export as WebP with 0.7 quality
              const dataUrl = canvas.toDataURL('image/webp', 0.7);
              setProfile(prev => ({ ...prev, avatar_url: dataUrl }));
          };
          img.src = event.target.result;
      };
      reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        await api.put('/admin/profile', profile);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
        alert("Failed to update profile");
    } finally {
        setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
      e.preventDefault();
      if (passwords.next !== passwords.confirm) return alert("Passwords do not match!");
      setSaving(true);
      try {
          await api.put('/admin/settings/password', {
              currentPassword: passwords.current,
              newPassword: passwords.next
          });
          setSuccess(true);
          setPasswords({ current: '', next: '', confirm: '' });
          setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
          alert(err.response?.data?.error || "Failed to change password");
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div style={{padding:'3rem', textAlign:'center'}}><div className="spinner"></div></div>;

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="page-title">Executive Settings</h1>
          <p className="page-subtitle">Personalization, security protocols, and system-wide configurations.</p>
        </div>
      </div>

      <div className="settings-container" style={{display:'flex', gap:'2rem', alignItems: 'start', flexWrap: 'wrap'}}>
          
          {/* ── Left Sidebar: Professional Menu ── */}
          <div className="glass-card settings-nav" style={{padding:'1.2rem', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.4)', borderRadius:'20px', width: '280px', flexShrink: 0}}>
              <div style={{padding:'0 10px 1rem 10px', borderBottom:'1px solid #e2e8f0', marginBottom:'1rem'}}>
                  <p style={{fontSize:'0.7rem', fontWeight:800, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase'}}>Management</p>
              </div>
              <nav style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                  <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<User size={20}/>} label="Personal Identity" color="#4f46e5" />
                  <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock size={20}/>} label="Security Vault" color="#ef4444" />
                  <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Globe size={20}/>} label="Brand & Locale" color="#10b981" />
              </nav>
              
              <div style={{marginTop:'2rem', padding:'0 10px 1rem 10px', borderBottom:'1px solid #e2e8f0', marginBottom:'1rem'}}>
                  <p style={{fontSize:'0.7rem', fontWeight:800, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase'}}>Appearance</p>
              </div>
              <nav style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                   <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'0.8rem 1rem', opacity:0.6, cursor:'not-allowed'}}>
                       <Palette size={20} /> <span style={{fontSize:'0.9rem', fontWeight:500}}>Theme Customizer</span>
                   </div>
              </nav>

              <div style={{marginTop:'2rem', padding:'1rem', background:'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius:'15px', color:'white'}}>
                  <Zap size={20} style={{marginBottom:'8px'}} />
                  <p style={{fontSize:'0.85rem', fontWeight:600, margin:0}}>Flick Pro Engine</p>
                  <p style={{fontSize:'0.7rem', opacity:0.8, margin:0}}>Stable Build v2.4.0</p>
              </div>
          </div>

          {/* ── Right Content: Dynamic Panels ── */}
          <div className="glass-card" style={{padding:'3rem', minHeight:'600px', background: 'white', borderRadius:'24px', boxShadow:'0 20px 50px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden'}}>
              
              {/* Decorative Background Element */}
              <div style={{position:'absolute', top:'-100px', right:'-100px', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)', borderRadius:'50%'}}></div>

              {/* 1. GENERAL PANEL */}
              {activeTab === 'general' && (
                  <div>
                      <div style={{display:'flex', alignItems:'center', gap:'25px', marginBottom:'3rem'}}>
                          <div style={{position:'relative'}}>
                              <div style={{
                                width: '110px', height: '110px', borderRadius:'30px', 
                                background: 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
                                border: '5px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow:'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                  {profile.avatar_url ? (
                                      <img src={profile.avatar_url} alt="Admin" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                  ) : (
                                      <User size={45} style={{color: 'var(--primary-200)'}} />
                                  )}
                              </div>
                              <input type="file" id="avatarInput" style={{display:'none'}} accept="image/*" onChange={handleFileSelect} />
                              <button 
                                type="button"
                                onClick={() => document.getElementById('avatarInput').click()}
                                style={{
                                    position: 'absolute', bottom: '-8px', right: '-8px',
                                    width: '36px', height: '36px', borderRadius:'12px', background: 'var(--primary-600)',
                                    border: '4px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 5px 15px rgba(79,70,229,0.3)', transition:'0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                  <Camera size={16} />
                              </button>
                          </div>
                          <div>
                              <h2 style={{margin:0, fontWeight:900, fontSize:'1.8rem', color:'#1e293b'}}>{profile.name}</h2>
                              <p style={{margin:0, color:'var(--text-muted)', fontSize:'1rem', fontWeight:500}}>Primary System Administrator / Owner</p>
                              <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                                  <span style={{background:'#e0f2fe', color:'#0369a1', fontSize:'0.65rem', fontWeight:800, padding:'5px 12px', borderRadius:'20px'}}>SUPER USER</span>
                                  <span style={{background:'#f0fdf4', color:'#15803d', fontSize:'0.65rem', fontWeight:800, padding:'5px 12px', borderRadius:'20px'}}>ACTIVE NODE</span>
                              </div>
                          </div>
                      </div>

                      <form onSubmit={handleUpdate} style={{display:'flex', flexDirection:'column', gap: '2rem'}}>
                          <div style={{display:'flex', gap:'2rem', flexWrap: 'wrap'}}>
                              <PremiumField uid="dispName" name="name" icon={<User size={18}/>} label="DISPLAY NAME" value={profile.name} onChange={v => setProfile({...profile, name: v})} color="#4f46e5" autoComplete="name" />
                              <PremiumField uid="contNum" name="phone" icon={<Phone size={18}/>} label="CONTACT NUMBER" value={profile.phone} onChange={v => setProfile({...profile, phone: v})} color="#4f46e5" autoComplete="tel" />
                          </div>
                          <PremiumField uid="identEmail" name="email" icon={<Mail size={18}/>} label="EMAIL ADDRESS (IDENTITY)" value={profile.email} readOnly color="#4f46e5" autoComplete="email" />

                          <div style={{display:'flex', justifyContent: 'flex-end', marginTop:'1rem'}}>
                              <button type="submit" className="btn btn-primary" disabled={saving} style={{padding:'1rem 3rem', borderRadius:'15px', fontWeight:700, fontSize:'1rem', boxShadow:'0 10px 20px rgba(79,70,229,0.2)'}}>
                                  {success ? <><Check size={20}/> Saved Successfully</> : <><Save size={20}/> {saving ? 'Processing...' : 'Apply Changes'}</>}
                              </button>
                          </div>
                      </form>
                  </div>
              )}

              {/* 2. SECURITY PANEL */}
              {activeTab === 'security' && (
                  <div>
                      <h3 style={{fontWeight:900, fontSize:'1.5rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'12px', color:'#1e293b'}}>
                          <ShieldCheck size={28} style={{color:'#ef4444'}} /> Security Control Center
                      </h3>
                      
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2.5rem'}}>
                          <div style={{background:'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', padding:'1.5rem', borderRadius:'20px', border:'1px solid #fca5a5'}}>
                              <Lock size={24} style={{color:'#dc2626', marginBottom:'10px'}} />
                              <p style={{fontSize:'0.9rem', fontWeight:700, color:'#991b1b', margin:0}}>Encryption: AES-256</p>
                              <p style={{fontSize:'0.75rem', color:'#b91c1c', opacity:0.8}}>Your passwords are hashed and salted before storage.</p>
                          </div>
                          <div style={{background:'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding:'1.5rem', borderRadius:'20px', border:'1px solid #bae6fd'}}>
                              <Shield size={24} style={{color:'#0284c7', marginBottom:'10px'}} />
                              <p style={{fontSize:'0.9rem', fontWeight:700, color:'#075985', margin:0}}>Account Lockdown</p>
                              <p style={{fontSize:'0.75rem', color:'#0369a1', opacity:0.8}}>Locked after 5 failed attempts for 15 minutes.</p>
                          </div>
                      </div>

                      <form onSubmit={handlePasswordChange} style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                          <div style={{position:'relative'}}>
                              <label htmlFor="masterPass" style={labelStyle}>CURRENT MASTER PASSWORD</label>
                              <div style={{position:'relative'}}>
                                  <Lock size={18} style={{position:'absolute', left:'15px', top:'13px', color:'var(--text-muted)'}} />
                                  <input 
                                    id="masterPass"
                                    name="currentPassword"
                                    className="auth-input" 
                                    type={showPass ? 'text' : 'password'}
                                    value={passwords.current}
                                    onChange={e => setPasswords({...passwords, current:e.target.value})}
                                    required
                                    placeholder="Verify your identity..."
                                    style={{paddingLeft:'45px', marginBottom:0}}
                                    autoComplete="current-password"
                                  />
                                  <button type="button" onClick={() => setShowPass(!showPass)} style={{position:'absolute', right:'15px', top:'10px', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
                                      {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                  </button>
                              </div>
                          </div>

                          <div style={{display:'flex', gap:'2rem', flexWrap: 'wrap'}}>
                              <PremiumField uid="newPass" name="newPassword" icon={<Shield size={18}/>} label="NEW PASSWORD" type="password" value={passwords.next} onChange={v => setPasswords({...passwords, next: v})} required color="#dc2626" autoComplete="new-password" />
                              <PremiumField uid="confPass" name="confirmPassword" icon={<Shield size={18}/>} label="CONFIRM NEW" type="password" value={passwords.confirm} onChange={v => setPasswords({...passwords, confirm: v})} required color="#dc2626" autoComplete="new-password" />
                          </div>

                          <div style={{display:'flex', justifyContent: 'flex-end', marginTop:'1rem'}}>
                              <button type="submit" className="btn btn-primary" disabled={saving} style={{padding:'1rem 3rem', background:'#dc2626', borderColor:'#dc2626', borderRadius:'15px', fontWeight:700, boxShadow:'0 10px 20px rgba(220,38,38,0.2)'}}>
                                  {success ? 'Vault Updated!' : 'Commit New Password'}
                              </button>
                          </div>
                      </form>
                  </div>
              )}

              {/* 3. SYSTEM PANEL */}
              {activeTab === 'system' && (
                  <div>
                      <h3 style={{fontWeight:900, fontSize:'1.5rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'12px', color:'#1e293b'}}>
                          <Globe size={28} style={{color:'#10b981'}} /> Global System Configuration
                      </h3>
                      
                      <form style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                          <div style={{display:'flex', gap:'2rem', flexWrap: 'wrap'}}>
                              <PremiumField uid="compName" name="company" icon={<Briefcase size={18}/>} label="COMPANY / BRAND NAME" value={system.company} onChange={v => setSystem({...system, company: v})} color="#10b981" />
                              <PremiumField uid="globSupp" name="supportNum" icon={<Phone size={18}/>} label="GLOBAL SUPPORT NUMBER" value={system.supportNum} onChange={v => setSystem({...system, supportNum: v})} color="#10b981" />
                          </div>
                          
                          <div style={{display:'flex', gap:'2rem', flexWrap: 'wrap'}}>
                              <PremiumField uid="platCurr" name="currency" icon={<Coins size={18}/>} label="PLATFORM CURRENCY" value={system.currency} onChange={v => setSystem({...system, currency: v})} color="#10b981" />
                              <PremiumField uid="taxRate" name="tax" icon={<Zap size={18}/>} label="SERVICE TAX RATE (%)" value={system.tax} onChange={v => setSystem({...system, tax: v})} color="#10b981" />
                          </div>

                          <div style={{display:'flex', justifyContent: 'flex-end', marginTop:'1rem'}}>
                              <button type="button" onClick={() => alert("Global configuration saved locally for this session.")} className="btn btn-primary" style={{padding:'1rem 3rem', background:'#10b981', borderColor:'#10b981', borderRadius:'15px', fontWeight:700, boxShadow:'0 10px 20px rgba(16,185,129,0.2)'}}>
                                  Save System Props
                              </button>
                          </div>
                      </form>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, color }) {
    return (
        <button 
            onClick={onClick}
            style={{
                width: '100%', padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '15px',
                border: 'none', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: active ? color : 'transparent',
                color: active ? 'white' : '#64748b',
                fontWeight: active ? 700 : 500,
                textAlign: 'left',
                boxShadow: active ? `0 10px 20px ${color}30` : 'none',
                transform: active ? 'translateX(5px)' : 'none'
            }}
            onMouseOver={e => !active && (e.currentTarget.style.background = '#f1f5f9')}
            onMouseOut={e => !active && (e.currentTarget.style.background = 'transparent')}
        >
            {icon}
            <span style={{fontSize:'0.95rem'}}>{label}</span>
        </button>
    );
}

function PremiumField({ uid, name, icon, label, value, onChange, type = "text", readOnly = false, required = false, autoComplete, color }) {
    return (
        <div style={{flex: 1, minWidth: '250px'}}>
            <label htmlFor={uid} style={labelStyle}>{label}</label>
            <div style={{position:'relative'}}>
                <div style={{position:'absolute', left:'15px', top:'13px', color: readOnly ? '#94a3b8' : color, opacity:0.8}}>
                    {icon}
                </div>
                <input 
                    id={uid}
                    name={name}
                    className="auth-input" 
                    type={type} 
                    value={value} 
                    onChange={e => onChange && onChange(e.target.value)} 
                    readOnly={readOnly}
                    required={required}
                    autoComplete={autoComplete}
                    style={{
                        marginBottom: 0, 
                        paddingLeft:'45px', 
                        background: readOnly ? '#f8fafc' : 'white',
                        borderColor: readOnly ? '#e2e8f0' : 'rgba(0,0,0,0.08)',
                        color: readOnly ? '#64748b' : '#1e293b',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        boxShadow: readOnly ? 'none' : '0 4px 6px rgba(0,0,0,0.02)'
                    }}
                />
            </div>
        </div>
    );
}

function ToggleRow({ icon, label, desc, enabled, onToggle, color }) {
    return (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'1.2rem', borderRadius:'20px', border:'1px solid #f1f5f9', transition:'0.2s'}}
             onMouseOver={e => e.currentTarget.style.borderColor = color}
             onMouseOut={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <div style={{width:'45px', height:'45px', borderRadius:'15px', background:`${color}15`, color:color, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {icon}
                </div>
                <div>
                    <p style={{margin:0, fontWeight:700, color:'#1e293b'}}>{label}</p>
                    <p style={{margin:0, fontSize:'0.8rem', color:'var(--text-muted)'}}>{desc}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                style={{
                    width:'55px', height:'30px', borderRadius:'30px', 
                    background: enabled ? color : '#cbd5e1',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: '0.3s'
                }}
            >
                <div style={{
                    width:'24px', height:'24px', borderRadius:'50%', background:'white',
                    position:'absolute', top:'3px', left: enabled ? '28px' : '3px',
                    transition: '0.3s', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'
                }}></div>
            </button>
        </div>
    );
}

const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', letterSpacing:'0.8px'
};
