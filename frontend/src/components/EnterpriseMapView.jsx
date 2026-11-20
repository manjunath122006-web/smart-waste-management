import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Eye, Play, Pause, Navigation, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EnterpriseMapView({
  depot = { name: 'Central Municipal Depot', latitude: 12.9716, longitude: 77.5946 },
  bins = [],
  vehicles = [],
  routes = [],
  activeZone = 'ALL',
  selectedVehicleId = null,
  selectedRouteId = null,
  onSelectBin = () => {},
  onSelectVehicle = () => {},
  height = '500px',
  isSimulationPlaying = false,
  onToggleSimulation = () => {}
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    bins: null,
    vehicles: null,
    routes: null,
    depot: null,
    hotspots: null
  });

  const [activeLayers, setActiveLayers] = useState({
    bins: true,
    vehicles: true,
    routes: true,
    depot: true,
    hotspots: true
  });

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => {
      const next = { ...prev, [layerKey]: !prev[layerKey] };
      const layer = layersRef.current[layerKey];
      if (layer && mapInstanceRef.current) {
        if (next[layerKey]) {
          mapInstanceRef.current.addLayer(layer);
        } else {
          mapInstanceRef.current.removeLayer(layer);
        }
      }
      return next;
    });
  };

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current._leaflet_id = null;
    }

    const initialCenter = [depot.latitude || 12.9716, depot.longitude || 77.5946];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Clean OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Create Layer Groups
    layersRef.current.depot = L.layerGroup().addTo(map);
    layersRef.current.routes = L.layerGroup().addTo(map);
    layersRef.current.bins = L.layerGroup().addTo(map);
    layersRef.current.vehicles = L.layerGroup().addTo(map);
    layersRef.current.hotspots = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Layers & Markers when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = [];

    // 1. Plot Depot Hub
    const depotGroup = layersRef.current.depot;
    depotGroup.clearLayers();
    if (depot && depot.latitude && depot.longitude) {
      const depotPos = [depot.latitude, depot.longitude];
      bounds.push(depotPos);

      const depotIcon = L.divIcon({
        className: 'custom-depot-pin',
        html: `
          <div style="background: #1e293b; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 14px; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
            🏢
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      L.marker(depotPos, { icon: depotIcon })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; padding: 4px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">🏢 ${depot.name || 'Central Municipal Depot'}</div>
            <div style="color: #64748b; font-size: 11px;">Primary Fleet Operations & Triage Hub</div>
            <div style="margin-top: 4px; font-size: 11px; color: #059669; font-weight: 600;">Coordinates: ${depot.latitude}, ${depot.longitude}</div>
          </div>
        `)
        .addTo(depotGroup);
    }

    // 2. Filter & Plot Waste Bins
    const binsGroup = layersRef.current.bins;
    binsGroup.clearLayers();

    const filteredBins = bins.filter(b => {
      if (activeZone && activeZone !== 'ALL' && b.zone !== activeZone) return false;
      return true;
    });

    filteredBins.forEach(bin => {
      const binPos = [bin.latitude, bin.longitude];
      bounds.push(binPos);

      // Status color mapping
      let markerColor = '#10b981'; // Normal
      let borderGlow = 'rgba(16, 185, 129, 0.3)';
      let label = `${Math.round(bin.current_fill_percent)}%`;

      if (bin.status === 'CRITICAL' || bin.current_fill_percent >= 90) {
        markerColor = '#dc2626';
        borderGlow = 'rgba(220, 38, 38, 0.4)';
      } else if (bin.status === 'WARNING' || bin.current_fill_percent >= 75) {
        markerColor = '#ea580c';
        borderGlow = 'rgba(234, 88, 12, 0.4)';
      } else if (bin.status === 'COLLECTING') {
        markerColor = '#2563eb';
        borderGlow = 'rgba(37, 99, 235, 0.4)';
        label = '🚚';
      }

      const binIcon = L.divIcon({
        className: 'custom-bin-pin',
        html: `
          <div style="background: ${markerColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 2px 6px ${borderGlow}; cursor: pointer; transition: transform 0.15s ease;">
            ${label}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(binPos, { icon: binIcon })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; min-width: 200px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #0f172a;">${bin.bin_code}</span>
              <span style="font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 99px; background: ${markerColor}15; color: ${markerColor};">${bin.status}</span>
            </div>
            <div style="color: #334155; font-size: 12px; margin-bottom: 2px;">📍 <b>${bin.location_name}</b></div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">Zone: ${bin.zone} • Type: ${bin.waste_type}</div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-top: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                <span>Fill Level (Simulated):</span>
                <b style="color: ${markerColor};">${bin.current_fill_percent}%</b>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Priority Score:</span>
                <b>${bin.priority_score}</b>
              </div>
            </div>
          </div>
        `)
        .addTo(binsGroup);

      marker.on('click', () => {
        onSelectBin(bin);
      });
    });

    // 3. Plot Vehicles
    const vehiclesGroup = layersRef.current.vehicles;
    vehiclesGroup.clearLayers();

    vehicles.forEach(veh => {
      const vehPos = [veh.latitude, veh.longitude];
      bounds.push(vehPos);

      const isSelected = selectedVehicleId && veh.id === selectedVehicleId;
      const statusColor = veh.status === 'EN_ROUTE' ? '#059669' : veh.status === 'COLLECTING' ? '#2563eb' : '#ea580c';

      const vehIcon = L.divIcon({
        className: 'custom-vehicle-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: #ffffff; border: 2px solid ${statusColor}; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); ${isSelected ? 'outline: 3px solid #059669; outline-offset: 2px;' : ''}">
              🚛
            </div>
            <div style="background: #0f172a; color: #ffffff; font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
              ${veh.vehicle_code}
            </div>
          </div>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 24]
      });

      const vehMarker = L.marker(vehPos, { icon: vehIcon })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; min-width: 220px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #0f172a;">🚛 ${veh.vehicle_code} (${veh.model})</span>
              <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 99px; background: ${statusColor}15; color: ${statusColor};">${veh.status}</span>
            </div>
            <div style="font-size: 12px; color: #334155; margin-bottom: 2px;">Driver: <b>${veh.driver_name}</b></div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Payload: ${veh.current_load_kg} / ${veh.capacity_kg} kg (${Math.round((veh.current_load_kg / veh.capacity_kg) * 100)}%)</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Progress: <b>${veh.total_stops_completed}</b> / ${veh.total_stops_assigned} stops completed</div>
            <div style="font-size: 10px; color: #059669; background: #ecfdf5; padding: 3px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
              Simulated Telemetry • Next Stop: ${veh.total_stops_completed < veh.total_stops_assigned ? `Stop #${veh.total_stops_completed + 1}` : 'Returning to Depot'}
            </div>
          </div>
        `)
        .addTo(vehiclesGroup);

      vehMarker.on('click', () => {
        onSelectVehicle(veh);
      });
    });

    // 4. Plot Routes
    const routesGroup = layersRef.current.routes;
    routesGroup.clearLayers();

    const routeColorPalette = ['#059669', '#2563eb', '#7c3aed', '#ea580c'];

    routes.forEach((route, idx) => {
      const color = routeColorPalette[idx % routeColorPalette.length];
      if (route.coords && route.coords.length > 1) {
        L.polyline(route.coords, {
          color: color,
          weight: 4,
          opacity: 0.85,
          dashArray: route.isBaseline ? '4, 8' : undefined
        })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <b>${route.name || `Route ${idx + 1}`}</b><br/>
            <span>Distance: <b>${route.distance_km || 0} km</b></span><br/>
            <span>Efficiency Gain: <b style="color: #059669;">${route.efficiency || '28.4%'}</b></span>
          </div>
        `)
        .addTo(routesGroup);

        route.coords.forEach(c => bounds.push(c));
      }
    });

    // Auto-fit bounds if we have points and invalidate layout size
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    }

    const timer = setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [depot, bins, vehicles, routes, activeZone, selectedVehicleId, selectedRouteId]);

  return (
    <div className="dashboard-card" style={{ height: '100%' }}>
      {/* Map Card Header with Layer Controls and Simulation Toggles */}
      <div className="card-header-clean">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Navigation size={18} color="var(--brand-emerald)" />
          <div>
            <h3 style={{ margin: 0 }}>Smart Municipal Operations Map</h3>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Interactive Telemetry • Leaflet Engine • {activeZone === 'ALL' ? 'Metropolitan Service Boundary' : activeZone}
            </div>
          </div>
        </div>

        <div className="card-header-controls">
          {/* Layer visibility buttons */}
          <button 
            className={`layer-toggle-btn ${activeLayers.bins ? 'active' : ''}`}
            onClick={() => toggleLayer('bins')}
            title="Toggle Bins Layer"
          >
            <span>🗑️ Bins ({bins.length})</span>
          </button>

          <button 
            className={`layer-toggle-btn ${activeLayers.vehicles ? 'active' : ''}`}
            onClick={() => toggleLayer('vehicles')}
            title="Toggle Fleet Layer"
          >
            <span>🚛 Fleet ({vehicles.length})</span>
          </button>

          <button 
            className={`layer-toggle-btn ${activeLayers.routes ? 'active' : ''}`}
            onClick={() => toggleLayer('routes')}
            title="Toggle Collection Routes"
          >
            <span>🛣️ Routes</span>
          </button>

          {/* Simulation Toggle */}
          <button 
            className="btn-primary btn-sm"
            style={{ 
              backgroundColor: isSimulationPlaying ? '#ea580c' : 'var(--brand-emerald)',
              borderColor: isSimulationPlaying ? '#c2410c' : 'var(--brand-emerald-dark)',
              marginLeft: '0.4rem'
            }}
            onClick={onToggleSimulation}
          >
            {isSimulationPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isSimulationPlaying ? 'Pause Fleet' : 'Simulate Fleet'}</span>
          </button>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="map-viewport-wrapper" style={{ height: height || '480px', minHeight: height || '480px' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: height || '480px' }} />

        {/* Informative Floating Legend */}
        <div className="map-legend-overlay">
          <div className="legend-title">Telemetry Status Legend</div>
          <div className="legend-row">
            <span className="legend-dot" style={{ backgroundColor: '#dc2626' }}></span>
            <span>Critical Overflow (&gt;90% Fill)</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ backgroundColor: '#ea580c' }}></span>
            <span>Warning (&gt;75% Fill)</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
            <span>Normal Bin (&lt;75% Fill)</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ backgroundColor: '#2563eb' }}></span>
            <span>Active Collection</span>
          </div>
          <div className="legend-row" style={{ marginTop: '0.35rem', paddingTop: '0.3rem', borderTop: '1px solid #e2e8f0' }}>
            <span className="legend-line" style={{ backgroundColor: '#059669' }}></span>
            <span>OR-Tools Optimized Path</span>
          </div>
          <div className="legend-row">
            <span className="legend-line" style={{ backgroundColor: '#64748b', borderTop: '1px dashed #64748b' }}></span>
            <span>Baseline Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
