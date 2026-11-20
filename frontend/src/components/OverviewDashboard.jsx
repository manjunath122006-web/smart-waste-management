import React, { useState } from 'react';
import KPICardsRow from './KPICardsRow';
import EnterpriseMapView from './EnterpriseMapView';
import OperationsPanel from './OperationsPanel';
import BottomAnalyticsGrid from './BottomAnalyticsGrid';
import { RefreshCw, Play, Pause, Navigation, AlertTriangle, ArrowRight } from 'lucide-react';

export default function OverviewDashboard({
  summary = null,
  bins = [],
  vehicles = [],
  complaints = [],
  routes = [],
  latestRoute = null,
  activeZone = 'ALL',
  onRefresh = () => {},
  loading = false,
  onNavigateTo = () => {}
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(false);

  // Toggle simulated fleet movement
  const handleToggleSimulation = () => {
    setIsSimulationPlaying(prev => !prev);
  };

  return (
    <div className="page-container">
      {/* 1. Page Header with Refresh and Quick Actions */}
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Municipal Waste Operations Center</h2>
          <p>
            Real-time urban telemetry, container capacity status, fleet dispatch, and combinatorial route efficiency (SDG 11.6).
          </p>
        </div>
        <div className="header-action-group">
          <button className="btn-secondary btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'spin-anim' : ''} />
            <span>Refresh Telemetry</span>
          </button>
          <button className="btn-primary btn-sm" onClick={() => onNavigateTo('routes')}>
            <Navigation size={13} />
            <span>OR-Tools Optimizer</span>
          </button>
        </div>
      </div>

      {/* 2. Six Compact Enterprise KPI Cards */}
      <KPICardsRow 
        summary={summary}
        bins={bins}
        vehicles={vehicles}
        complaints={complaints}
      />

      {/* 3. Central Interactive Map + Right Operations Panel */}
      <div className="map-operations-layout">
        <EnterpriseMapView
          depot={{ name: 'Central Municipal Waste Depot', latitude: 12.9716, longitude: 77.5946 }}
          bins={bins}
          vehicles={vehicles}
          routes={routes.length > 0 ? routes : (latestRoute ? [{
            name: latestRoute.route_name || 'Active Smart Route',
            coords: latestRoute?.geojson?.features?.[0]?.geometry?.coordinates
              ? latestRoute.geojson.features[0].geometry.coordinates.map(c => [c[1], c[0]])
              : [],
            distance_km: latestRoute.total_optimized_distance_km,
            efficiency: `${latestRoute.distance_reduction_percent}%`
          }] : [])}
          activeZone={activeZone}
          selectedVehicleId={selectedVehicle?.id}
          onSelectBin={setSelectedBin}
          onSelectVehicle={setSelectedVehicle}
          height="510px"
          isSimulationPlaying={isSimulationPlaying}
          onToggleSimulation={handleToggleSimulation}
        />

        <OperationsPanel
          bins={bins}
          vehicles={vehicles}
          latestRoute={latestRoute}
          onSelectVehicle={setSelectedVehicle}
        />
      </div>

      {/* 4. Bottom Analytics Grid */}
      <div style={{ marginTop: '0.5rem', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Operational Analytics & Telemetry Indices
          </h3>
          <button 
            className="btn-secondary btn-sm" 
            style={{ fontSize: '0.72rem' }}
            onClick={() => onNavigateTo('analytics')}
          >
            <span>Full Analytics Suite</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <BottomAnalyticsGrid
          bins={bins}
          vehicles={vehicles}
          summary={summary}
          activeZone={activeZone}
        />
      </div>
    </div>
  );
}
