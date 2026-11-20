import React from 'react';
import { 
  LayoutDashboard, Map, Trash2, Truck, Navigation, 
  CheckSquare, MessageSquare, BarChart3, Bell, 
  FileText, Cpu, Settings, ShieldCheck, Leaf 
} from 'lucide-react';

export default function Sidebar({
  activeNav = 'overview',
  onSelectNav = () => {},
  kpiCounts = {},
  isMobileOpen = false,
  onCloseMobile = () => {}
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'live-map', label: 'Live Map', icon: Map, badge: 'Live' },
    { id: 'bins', label: 'Waste Bins', icon: Trash2, badge: kpiCounts.total_bins || null },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, badge: kpiCounts.active_vehicles || null },
    { id: 'routes', label: 'Routes & Optimization', icon: Navigation, badge: 'OR-Tools' },
    { id: 'tasks', label: 'Collection Tasks', icon: CheckSquare, badge: kpiCounts.pending_collections || null },
    { id: 'complaints', label: 'Citizen Complaints', icon: MessageSquare, badge: kpiCounts.citizen_complaints_open || null },

    { id: 'analytics', label: 'Waste Analytics', icon: BarChart3, badge: null },
    { id: 'alerts', label: 'Alerts & Notifications', icon: Bell, badge: '3' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'iot', label: 'IoT Sensors', icon: Cpu, badge: 'Stream' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Leaf size={20} />
        </div>
        <div className="sidebar-brand-text">
          <h1>EcoRoute <span>AI</span></h1>
          <div className="sidebar-brand-subtitle">Smart Waste Collection & Route Optimization</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Operations Control</div>

        {navItems.slice(0, 7).map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelectNav(item.id);
                onCloseMobile();
              }}
            >
              <Icon size={17} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: '0.4rem' }}>Analytics & Intelligence</div>

        {navItems.slice(7).map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelectNav(item.id);
                onCloseMobile();
              }}
            >
              <Icon size={17} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* SDG 11.6 Aligned Badge */}
      <div className="sidebar-footer">
        <div className="sidebar-sdg-card">
          <span className="sidebar-sdg-icon">🌱</span>
          <div className="sidebar-sdg-info">
            <strong>UN SDG 11.6 Aligned</strong>
            <span>Urban waste impact & vehicular emissions reduction</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
