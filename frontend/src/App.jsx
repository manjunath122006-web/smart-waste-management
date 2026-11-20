import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import OverviewDashboard from './components/OverviewDashboard';
import LiveMapView from './components/LiveMapView';
import WasteBinsView from './components/WasteBinsView';
import VehiclesView from './components/VehiclesView';
import RouteOptimizerView from './components/RouteOptimizerView';
import CollectionTasksView from './components/CollectionTasksView';
import ComplaintsView from './components/ComplaintsView';
import WasteAnalyticsView from './components/WasteAnalyticsView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import IoTSensorsView from './components/IoTSensorsView';
import SettingsView from './components/SettingsView';
import LoginModal from './components/LoginModal';

import { 
  fetchDashboardSummary, fetchComplaints, fetchBins, 
  fetchVehicles, fetchLatestRoute 
} from './services/api';

export default function App() {
  const [activeNav, setActiveNav] = useState('overview');
  const [activeZone, setActiveZone] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication State
  const [user, setUser] = useState({
    email: 'admin@ecoroute.local',
    full_name: 'Municipal Operations Director',
    role: 'admin'
  });
  const [token, setToken] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Application Data States
  const [summary, setSummary] = useState(null);
  const [bins, setBins] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [latestRoute, setLatestRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load telemetry from FastAPI backend
  const loadApplicationData = async () => {
    setLoading(true);
    try {
      const [sumData, binData, vehData, compData, routeData] = await Promise.all([
        fetchDashboardSummary().catch(() => null),
        fetchBins({ zone: activeZone === 'ALL' ? undefined : activeZone }).catch(() => []),
        fetchVehicles().catch(() => []),
        fetchComplaints().catch(() => []),
        fetchLatestRoute().catch(() => null)
      ]);

      if (sumData) setSummary(sumData);
      if (binData && binData.length > 0) setBins(binData);
      if (vehData && vehData.length > 0) setVehicles(vehData);
      if (compData && compData.length > 0) setComplaints(compData);
      if (routeData) setLatestRoute(routeData);
    } catch (err) {
      console.error('Failed to load application telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicationData();
  }, [activeZone]);

  const handleLoginSuccess = (authData) => {
    setToken(authData.access_token);
    const userData = { email: authData.email, full_name: authData.full_name, role: authData.role };
    setUser(userData);
    localStorage.setItem('ecoroute_token', authData.access_token);
    localStorage.setItem('ecoroute_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ecoroute_token');
    localStorage.removeItem('ecoroute_user');
  };

  return (
    <div className="app-layout">
      {/* 1. Left Persistent Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        kpiCounts={{
          total_bins: bins.length || summary?.total_bins,
          active_vehicles: vehicles.length || summary?.active_vehicles,
          pending_collections: bins.filter(b => b.status === 'CRITICAL' || b.status === 'WARNING').length,
          citizen_complaints_open: complaints.filter(c => c.status !== 'RESOLVED').length
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Wrapper */}
      <div className="app-main">
        {/* Top Header */}
        <TopHeader
          activeNav={activeNav}
          activeZone={activeZone}
          onChangeZone={setActiveZone}
          dateFilter={dateFilter}
          onChangeDateFilter={setDateFilter}
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          user={user}
          onLogout={handleLogout}
          onOpenLogin={() => setLoginModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenNotifications={() => setActiveNav('alerts')}
        />

        {/* Dynamic Route View */}
        <main style={{ flex: 1 }}>
          {activeNav === 'overview' && (
            <OverviewDashboard
              summary={summary}
              bins={bins}
              vehicles={vehicles}
              complaints={complaints}
              latestRoute={latestRoute}
              activeZone={activeZone}
              onRefresh={loadApplicationData}
              loading={loading}
              onNavigateTo={setActiveNav}
            />
          )}

          {activeNav === 'live-map' && (
            <LiveMapView
              bins={bins}
              vehicles={vehicles}
              latestRoute={latestRoute}
              activeZone={activeZone}
              onRefresh={loadApplicationData}
            />
          )}

          {activeNav === 'bins' && (
            <WasteBinsView
              bins={bins}
              onRefresh={loadApplicationData}
              loading={loading}
              activeZone={activeZone}
            />
          )}

          {activeNav === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              onRefresh={loadApplicationData}
              loading={loading}
            />
          )}

          {activeNav === 'routes' && (
            <RouteOptimizerView />
          )}

          {activeNav === 'tasks' && (
            <CollectionTasksView
              vehicles={vehicles}
              bins={bins}
            />
          )}

          {activeNav === 'complaints' && (
            <ComplaintsView
              token={token}
              onSelectForRouting={() => setActiveNav('routes')}
            />
          )}

          {activeNav === 'analytics' && (
            <WasteAnalyticsView
              summary={summary}
              bins={bins}
              vehicles={vehicles}
            />
          )}

          {activeNav === 'alerts' && (
            <AlertsView />
          )}

          {activeNav === 'reports' && (
            <ReportsView
              summary={summary}
              bins={bins}
              vehicles={vehicles}
            />
          )}

          {activeNav === 'iot' && (
            <IoTSensorsView
              bins={bins}
            />
          )}

          {activeNav === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
