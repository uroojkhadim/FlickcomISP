import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Send, User, MessageCircle, Phone, Mail, Circle,
  ChevronRight, Clock, CheckCheck, Smile, Paperclip, MoreVertical,
  RefreshCw, Users, Inbox, X, Star, AlertCircle
} from 'lucide-react';
import api from '../api/axios';

// ─── Helpers ───────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Quick Reply Templates ──────────────────────────────────
const QUICK_REPLIES = [
  'Thank you for contacting support! How can I help you today?',
  'I understand your concern. Let me look into this for you.',
  'Your issue has been escalated to our technical team.',
  'We apologize for the inconvenience. The issue will be resolved within 24 hours.',
  'Please restart your router and check if the issue persists.',
  'Your account is now active. Please try reconnecting.',
];

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════
const SupportChat = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [filter, setFilter] = useState('all'); // all | unread
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  // ── Data Fetching ──────────────────────────────────────
  const fetchChatUsers = async () => {
    try {
      const res = await api.get('/admin/chat/users');
      if (res.data.success) setChatUsers(res.data.data || []);
    } catch (err) {
      if (err.response?.status !== 401) console.error('Fetch users error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/admin/chat/messages/${userId}`);
      if (res.data.success) setMessages(res.data.messages || []);
    } catch (err) {
      if (err.response?.status !== 401) console.error('Fetch messages error:', err.message);
    }
  };

  useEffect(() => {
    fetchChatUsers();
    const iv = setInterval(fetchChatUsers, 8000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      pollingRef.current = setInterval(() => fetchMessages(selectedUser.id), 3000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send Message ────────────────────────────────────────
  const handleSend = async (text) => {
    const msg = text || newMessage;
    if (!msg.trim() || !selectedUser || sending) return;

    setSending(true);
    setNewMessage('');
    setShowQuickReplies(false);

    // Optimistic update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      message: msg,
      sender_id: 'admin',
      created_at: new Date().toISOString(),
      temp: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await api.post('/admin/chat/send', { userId: selectedUser.id, message: msg });
      if (res.data.success) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.data.message : m));
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setNewMessage(msg);
      console.error('Send error:', err.message);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filtered Users ──────────────────────────────────────
  const filteredUsers = chatUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.user_id?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchesSearch;
  });

  const totalUnread = chatUsers.filter(u => u.lastMessage && u.lastMessage.sender_id !== 'admin').length;

  return (
    <>
      <style>{`
        /* ── Chat Page Layout ── */
        .chat-page {
          display: flex;
          height: calc(100vh - 160px);
          gap: 0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px -12px rgba(37,99,235,0.12), 0 0 0 1px rgba(255,255,255,0.6);
          animation: chatFadeIn 0.4s ease-out;
          background: white;
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Sidebar ── */
        .chat-sidebar {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: #fafbff;
          border-right: 1px solid #e8edf8;
        }
        .chat-sidebar-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #e8edf8;
          background: white;
        }
        .chat-sidebar-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .chat-sidebar-title h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .unread-badge {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .chat-search-box {
          position: relative;
        }
        .chat-search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .chat-search-input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.875rem;
          color: #0f172a;
          transition: all 0.2s;
          outline: none;
        }
        .chat-search-input:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .filter-tabs {
          display: flex;
          padding: 8px 20px;
          gap: 6px;
          background: #fafbff;
          border-bottom: 1px solid #e8edf8;
        }
        .filter-tab {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.2s;
        }
        .filter-tab.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }
        .filter-tab:not(.active) {
          color: #64748b;
          background: transparent;
        }
        .filter-tab:not(.active):hover {
          background: #f1f5f9;
        }
        .users-list {
          flex: 1;
          overflow-y: auto;
        }
        .users-list::-webkit-scrollbar { width: 4px; }
        .users-list::-webkit-scrollbar-track { background: transparent; }
        .users-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

        .user-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid rgba(232,237,248,0.5);
          position: relative;
        }
        .user-item:hover { background: #f0f4ff; }
        .user-item.selected {
          background: #eff6ff;
          border-left: 3px solid #2563eb;
        }
        .user-avatar {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3px;
        }
        .user-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: #0f172a;
          truncate: true;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .msg-time {
          font-size: 0.7rem;
          color: #94a3b8;
          flex-shrink: 0;
          margin-left: 6px;
        }
        .msg-preview {
          font-size: 0.78rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Main Chat Area ── */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: white;
        }
        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e8edf8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          flex-shrink: 0;
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-header-avatar {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          overflow: hidden;
        }
        .chat-header-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .chat-header-info h3 {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .chat-header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #64748b;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #dcfce7;
          color: #166534;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }

        /* ── Messages Area ── */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .messages-area::-webkit-scrollbar { width: 5px; }
        .messages-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }

        .date-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          margin: 8px 0;
        }
        .date-divider::before, .date-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .msg-row.admin-msg { flex-direction: row-reverse; }
        .msg-row.admin-msg .msg-avatar { display: none; }

        .msg-avatar {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.7rem;
          color: white;
          flex-shrink: 0;
        }
        .msg-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }

        .bubble-wrap { display: flex; flex-direction: column; max-width: 65%; }
        .msg-row.admin-msg .bubble-wrap { align-items: flex-end; }

        .bubble {
          padding: 11px 16px;
          border-radius: 18px;
          font-size: 0.875rem;
          line-height: 1.5;
          word-break: break-word;
          position: relative;
        }
        .bubble.customer-bubble {
          background: white;
          color: #0f172a;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .bubble.admin-bubble {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .bubble.admin-bubble.temp { opacity: 0.7; }
        .bubble-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          font-size: 0.68rem;
          color: #94a3b8;
        }
        .msg-row.admin-msg .bubble-meta { justify-content: flex-end; }

        /* ── Input Area ── */
        .chat-input-area {
          padding: 16px 24px;
          border-top: 1px solid #e8edf8;
          background: white;
          flex-shrink: 0;
        }
        .quick-replies-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 4px;
        }
        .quick-replies-strip::-webkit-scrollbar { display: none; }
        .quick-pill {
          padding: 6px 14px;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          border-radius: 20px;
          font-size: 0.78rem;
          color: #1d4ed8;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-weight: 500;
        }
        .quick-pill:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }
        .input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 6px 8px 6px 16px;
          transition: all 0.2s;
        }
        .input-row:focus-within {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .chat-textarea {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          resize: none;
          font-family: 'Outfit', sans-serif;
          line-height: 1.5;
          max-height: 100px;
          min-height: 24px;
        }
        .chat-textarea::placeholder { color: #94a3b8; }
        .input-icon-btn {
          padding: 8px;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .input-icon-btn:hover { background: #f1f5f9; color: #2563eb; }
        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 6px 18px rgba(37,99,235,0.4);
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Empty State ── */
        .empty-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: #64748b;
          text-align: center;
        }
        .empty-chat-icon {
          width: 88px;
          height: 88px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-radius: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(59,130,246,0.15);
        }
        .empty-chat h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .empty-chat p {
          font-size: 0.875rem;
          max-width: 280px;
          line-height: 1.6;
          color: #94a3b8;
        }
        .empty-sidebar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #94a3b8;
          text-align: center;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .chat-sidebar { width: 260px; }
          .chat-page { height: calc(100vh - 120px); }
          .messages-area { padding: 16px; }
        }
        @media (max-width: 600px) {
          .chat-sidebar { display: none; }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Support Chat</h1>
          <p className="page-subtitle">
            {chatUsers.length} conversation{chatUsers.length !== 1 ? 's' : ''}
            {totalUnread > 0 && ` · ${totalUnread} need${totalUnread === 1 ? 's' : ''} attention`}
          </p>
        </div>
        <button
          onClick={fetchChatUsers}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="chat-page">

        {/* ════════════════ SIDEBAR ════════════════ */}
        <div className="chat-sidebar">
          {/* Header */}
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title">
              <h2>
                <Inbox size={18} style={{ color: '#2563eb' }} />
                Inbox
              </h2>
              {totalUnread > 0 && <span className="unread-badge">{totalUnread}</span>}
            </div>
            <div className="chat-search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search customers..."
                className="chat-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({chatUsers.length})
            </button>
            <button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
              Active
            </button>
          </div>

          {/* Users List */}
          <div className="users-list">
            {loading ? (
              <div className="empty-sidebar">
                <div className="spinner" style={{ width: 28, height: 28, marginBottom: 12 }} />
                Loading conversations...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-sidebar">
                <Users size={32} style={{ marginBottom: 10, color: '#cbd5e1' }} />
                {searchQuery ? 'No results found' : 'No conversations yet'}
              </div>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUser?.id === user.id;
                const isAdmin = user.lastMessage?.sender_id !== user.id;
                return (
                  <div
                    key={user.id}
                    className={`user-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div
                      className="user-avatar"
                      style={{ background: getAvatarColor(user.name) }}
                    >
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt={user.name} />
                        : getInitials(user.name)}
                      <span className="online-dot" style={{ background: isSelected ? '#10b981' : '#cbd5e1' }} />
                    </div>
                    <div className="user-info">
                      <div className="user-name-row">
                        <span className="user-name">{user.name}</span>
                        <span className="msg-time">{timeAgo(user.lastMessage?.created_at)}</span>
                      </div>
                      <p className="msg-preview">
                        {isAdmin && '↩ '}
                        {user.lastMessage?.message || 'No messages yet'}
                      </p>
                    </div>
                    {isSelected && <ChevronRight size={14} style={{ color: '#2563eb', flexShrink: 0 }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ════════════════ MAIN CHAT ════════════════ */}
        <div className="chat-main">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <div
                    className="chat-header-avatar"
                    style={{ background: getAvatarColor(selectedUser.name) }}
                  >
                    {selectedUser.avatar_url
                      ? <img src={selectedUser.avatar_url} alt={selectedUser.name} />
                      : getInitials(selectedUser.name)}
                  </div>
                  <div className="chat-header-info">
                    <h3>{selectedUser.name}</h3>
                    <div className="chat-header-meta">
                      <span className="status-pill">
                        <Circle size={6} style={{ fill: '#10b981', color: '#10b981' }} />
                        Online
                      </span>
                      <span>{selectedUser.user_id}</span>
                      <span>·</span>
                      <span>{selectedUser.email}</span>
                    </div>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <a href={`tel:${selectedUser.phone}`} className="icon-btn" title="Call">
                    <Phone size={16} />
                  </a>
                  <a href={`mailto:${selectedUser.email}`} className="icon-btn" title="Email">
                    <Mail size={16} />
                  </a>
                  <button className="icon-btn" onClick={() => setSelectedUser(null)} title="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: 'auto' }}>
                    <MessageCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                    No messages yet. Send the first one!
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.sender_id !== selectedUser.id;
                    const prevMsg = messages[idx - 1];
                    const showDate = !prevMsg || 
                      new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="date-divider">
                            {new Date(msg.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        <div className={`msg-row ${isAdmin ? 'admin-msg' : ''}`}>
                          {!isAdmin && (
                            <div
                              className="msg-avatar"
                              style={{ background: getAvatarColor(selectedUser.name) }}
                            >
                              {selectedUser.avatar_url
                                ? <img src={selectedUser.avatar_url} alt={selectedUser.name} />
                                : getInitials(selectedUser.name)}
                            </div>
                          )}
                          <div className="bubble-wrap">
                            <div className={`bubble ${isAdmin ? 'admin-bubble' : 'customer-bubble'} ${msg.temp ? 'temp' : ''}`}>
                              {msg.message}
                            </div>
                            <div className="bubble-meta">
                              {isAdmin && <CheckCheck size={12} style={{ color: '#60a5fa' }} />}
                              <span>{formatTime(msg.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chat-input-area">
                {showQuickReplies && (
                  <div className="quick-replies-strip">
                    {QUICK_REPLIES.map((qr, i) => (
                      <button key={i} className="quick-pill" onClick={() => handleSend(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
                <div className="input-row">
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowQuickReplies(p => !p)}
                    title="Quick replies"
                    style={{ color: showQuickReplies ? '#2563eb' : undefined }}
                  >
                    <Smile size={18} />
                  </button>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    className="chat-textarea"
                    placeholder="Type your reply... (Enter to send)"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className="send-btn"
                    onClick={() => handleSend()}
                    disabled={!newMessage.trim() || sending}
                  >
                    <Send size={17} />
                  </button>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
                  Press <kbd style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '0.7rem' }}>Enter</kbd> to send · <kbd style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '0.7rem' }}>Shift+Enter</kbd> for new line
                </p>
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <MessageCircle size={44} style={{ color: '#2563eb' }} />
              </div>
              <h3>Select a Conversation</h3>
              <p>Choose a customer from the sidebar to view and reply to their support messages.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default SupportChat;
