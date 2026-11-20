import React, { useState } from 'react';
import { 
  Search, Bell, ShieldCheck, ChevronDown, 
  Menu, X, Sparkles, Filter, CheckCircle2 
} from 'lucide-react';

export default function TopHeader({
  activeNav = 'overview',
  activeZone = 'ALL',
  onChangeZone = () => {},
  dateFilter = 'today',
  onChangeDateFilter = () => {},
  searchQuery = '',
  onChangeSearchQuery = () => {},
  user = null,
  onLogout = () => {},
  onOpenLogin = () => {},
  onToggleMobileMenu = () => {},
  onOpenNotifications = () => {}
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getNavTitle = (id) => {
    switch (id) {
      case 'overview': return { title: 'Municipal Operations Overview', section: 'Operations' };
      case 'live-map': return { title: 'Live GIS Fleet & Bin Map', section: 'Operations' };
      case 'bins': return { title: 'Waste Bins Registry & Telemetry', section: 'Asset Management' };
      case 'vehicles': return { title: 'Fleet Vehicles & Payload Dispatch', section: 'Asset Management' };
      case 'routes': return { title: 'Google OR-Tools Route Optimizer', section: 'Optimization' };
      case 'tasks': return { title: 'Collection Tasks & Driver Log', section: 'Execution' };
      case 'complaints': return { title: 'Citizen Waste Grievances & AI Triage', section: 'Citizen Services' };
      case 'analytics': return { title: 'Municipal Waste Analytics & SDG 11', section: 'Intelligence' };
      case 'alerts': return { title: 'Active Threshold Alerts & Triggers', section: 'Monitoring' };
      case 'reports': return { title: 'Council Operational & Sustainability Reports', section: 'Reporting' };
      case 'iot': return { title: 'IoT Ultrasonic Bin Sensors Stream', section: 'Sensors' };
      case 'settings': return { title: 'Operations & Optimization Settings', section: 'System' };
      default: return { title: 'Operations Dashboard', section: 'EcoRoute AI' };
    }
  };

  const currentMeta = getNavTitle(activeNav);

  return (
    <header className="top-header">
      {/* Left side: Hamburger toggle + Breadcrumb + Search */}
      <div className="top-header-left">
        <button 
          className="icon-button" 
          onClick={onToggleMobileMenu}
          style={{ display: 'none' }} // Visible on mobile via CSS
          id="mobile-nav-toggle"
        >
          <Menu size={18} />
        </button>

        <div className="breadcrumb-nav">
          <span className="breadcrumb-parent">{currentMeta.section}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-active">{currentMeta.title}</span>
        </div>

        {/* Global Search Bar */}
        <div className="header-search-wrapper">
          <Search size={14} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search bins, trucks, complaints..."
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right side: Zone selector + Date filter + Demo badge + Status + Notifications + User */}
      <div className="top-header-right">
        {/* Area / Zone Selector */}
        <select 
          className="header-select"
          value={activeZone}
          onChange={(e) => onChangeZone(e.target.value)}
          title="Filter by Municipal Zone"
        >
          <option value="ALL">All Zones (Metropolitan)</option>
          <option value="Central Commercial">Central Commercial (Zone A)</option>
          <option value="East Market">East Market (Zone B)</option>
          <option value="West Residential">West Residential (Zone C)</option>
          <option value="South Suburbs">South Suburbs (Zone D)</option>
        </select>

        {/* Date Filter */}
        <select 
          className="header-select"
          value={dateFilter}
          onChange={(e) => onChangeDateFilter(e.target.value)}
          title="Date Range Filter"
        >
          <option value="today">Today, Oct 26</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">This Month (Oct 2026)</option>
        </select>

        {/* Simulation / Demo Data Clear Indicator */}
        <div className="demo-mode-badge" title="Simulated municipal dataset and GPS telemetry for academic demonstration">
          <Sparkles size={12} />
          <span>Demo Simulation Mode</span>
        </div>

        {/* System Health Status */}
        <div className="system-status-indicator" title="FastAPI Backend & OR-Tools Operational">
          <div className="status-dot-pulse"></div>
          <span>System Healthy</span>
        </div>

        {/* Notifications Bell */}
        <button 
          className="icon-button" 
          onClick={onOpenNotifications}
          title="3 High Priority Alerts"
        >
          <Bell size={16} />
          <span className="icon-badge-dot"></span>
        </button>

        {/* User Profile / Admin Menu */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <div 
              className="user-profile-chip"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="user-avatar">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="user-meta">
                <div className="user-name">{user.full_name}</div>
                <div className="user-role">{user.role === 'admin' ? 'Operations Director' : 'Citizen User'}</div>
              </div>
              <ChevronDown size={14} color="var(--text-dim)" />
            </div>

            {userDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: 190,
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.4rem',
                zIndex: 100
              }}>
                <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Signed in as<br/>
                  <b style={{ color: 'var(--text-primary)' }}>{user.email}</b>
                </div>
                <button 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.45rem 0.6rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-secondary btn-sm" onClick={onOpenLogin}>
            <ShieldCheck size={14} />
            <span>Admin Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
