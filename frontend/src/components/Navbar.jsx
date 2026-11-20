import React from 'react';
import { Trash2, MapPin, BarChart3, Navigation, Search, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, onOpenLogin }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon-wrapper">
          <Trash2 size={22} />
        </div>
        <div>
          <div className="brand-name">
            EcoRoute <span style={{ color: 'var(--primary-emerald)' }}>AI</span>
            <span className="brand-badge">AWS Cloud</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Smart Waste Management & Collection System
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <Trash2 size={16} />
          Report Waste
        </button>
        <button
          className={`nav-btn ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <Search size={16} />
          Track Complaint
        </button>
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={16} />
          Admin Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'optimizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimizer')}
        >
          <Navigation size={16} />
          Route Optimizer
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="sdg-chip" title="Sustainable Development Goal 11: Sustainable Cities & Communities">
          <span>🌱</span>
          <span>SDG 11.6 Target</span>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-emerald)', fontWeight: 600 }}>
              {user.full_name} ({user.role})
            </span>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={onOpenLogin}>
            <ShieldCheck size={14} />
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
}
