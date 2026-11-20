import React, { useState, useEffect } from 'react';
import { 
  Navigation, Play, CheckCircle2, TrendingDown, Fuel, 
  MapPin, RefreshCw, Layers, Clock, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { fetchComplaints, fetchBins, optimizeRoute } from '../services/api';
import EnterpriseMapView from './EnterpriseMapView';

export default function RouteOptimizerView({ initialSelectedIds = [] }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Configurable Constraints
  const [vehicleCapacityKg, setVehicleCapacityKg] = useState(8500);
  const [avgServiceTimeMin, setAvgServiceTimeMin] = useState(4.5);
  const [depotCoords, setDepotCoords] = useState({ name: 'Central Municipal Depot', latitude: 12.9716, longitude: 77.5946 });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaints();
      setComplaints(data);
      if (selectedIds.size === 0 && data.length > 0) {
        // Pre-select pending and high priority complaints
        const activeIds = data.filter(c => c.status !== 'RESOLVED').slice(0, 6).map(c => c.id);
        setSelectedIds(new Set(activeIds));
      }
    } catch (err) {
      setErrorMessage('Failed to load stops for route optimization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAllActive = () => {
    const activeIds = complaints.filter(c => c.status !== 'RESOLVED').map(c => c.id);
    setSelectedIds(new Set(activeIds));
  };

  const handleRunOptimization = async () => {
    if (selectedIds.size === 0) {
      setErrorMessage('Please select at least 1 stop for route planning.');
      return;
    }

    setIsSolving(true);
    setErrorMessage('');

    try {
      const payload = {
        route_name: `Smart Collection Route — ${new Date().toLocaleDateString()}`,
        complaint_ids: Array.from(selectedIds),
        depot_latitude: depotCoords.latitude,
        depot_longitude: depotCoords.longitude
      };

      const res = await optimizeRoute(payload);
      setOptimizationResult(res);
    } catch (err) {
      setErrorMessage(err.message || 'Route solver error.');
    } finally {
      setIsSolving(false);
    }
  };

  // Convert GeoJSON route coordinates to Leaflet [lat, lng] format
  const routeCoords = optimizationResult?.geojson?.features?.[0]?.geometry?.coordinates
    ? optimizationResult.geojson.features[0].geometry.coordinates.map(c => [c[1], c[0]])
    : [];

  const baselineDist = optimizationResult?.total_baseline_distance_km || 0;
  const optimizedDist = optimizationResult?.total_optimized_distance_km || 0;
  const reductionPct = optimizationResult?.distance_reduction_percent || 0;
  const stopCount = optimizationResult?.ordered_stops?.length || 0;

  // Transit calculations: 24 km/h urban speed + service time per stop
  const estDurationMin = Math.round((optimizedDist / 24) * 60 + (stopCount * avgServiceTimeMin));
  const baselineDurationMin = Math.round((baselineDist / 24) * 60 + (stopCount * avgServiceTimeMin));
  const timeSavedMin = Math.max(0, baselineDurationMin - estDurationMin);

  // Fuel calculation: 0.28 L/km diesel consumption
  const fuelOptimizedL = (optimizedDist * 0.28).toFixed(2);
  const fuelSavedL = (Math.max(0, baselineDist - optimizedDist) * 0.28).toFixed(2);
  const co2AvoidedKg = (fuelSavedL * 2.68).toFixed(2);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Google OR-Tools Route Optimizer</h2>
          <p>
            Constraint-programming Traveling Salesperson Problem (TSP) solver minimizing urban mileage, fuel consumption, and transit time (SDG 11.6).
          </p>
        </div>
        <div className="header-action-group">
          <button 
            className="btn-primary"
            onClick={handleRunOptimization}
            disabled={isSolving || selectedIds.size === 0}
          >
            <Play size={14} className={isSolving ? 'spin-anim' : ''} />
            <span>{isSolving ? 'Solving OR-Tools Graph...' : 'Optimize Routes'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '8px', color: '#dc2626', marginBottom: '1rem', fontSize: '0.82rem' }}>
          {errorMessage}
        </div>
      )}

      {/* Solver Metric Results Banner */}
      {optimizationResult && (
        <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', borderColor: '#a7f3d0', backgroundColor: '#f0fdf4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 color="#059669" size={22} />
              <div>
                <h3 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                  Optimal Collection Path Generated
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                  Combinatorial solver converged with {stopCount} stops starting & ending at {depotCoords.name}
                </div>
              </div>
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
              Formula: ((Baseline - Optimized) / Baseline) × 100
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Baseline Route Distance</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#64748b' }}>{baselineDist} km</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Sequential order of report arrival</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669' }}>OR-Tools Optimized Path</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#059669' }}>{optimizedDist} km</div>
              <div style={{ fontSize: '0.68rem', color: '#047857' }}>Guided Local Search Metaheuristic</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mileage Reduction</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#059669' }}>+{reductionPct}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Saved {(baselineDist - optimizedDist).toFixed(1)} km transit</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Fuel & Carbon</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2563eb' }}>{fuelOptimizedL} L</div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Avoided {co2AvoidedKg} kg CO₂ (SDG 11.6)</div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Map Preview + Selected Stops Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '1rem', alignItems: 'start' }}>
        {/* Left: Map Preview */}
        <div>
          <EnterpriseMapView
            depot={depotCoords}
            routes={routeCoords.length > 0 ? [{ name: 'Optimized Path', coords: routeCoords, distance_km: optimizedDist, efficiency: `${reductionPct}%` }] : []}
            bins={complaints.map(c => ({
              id: c.id,
              bin_code: c.tracking_number,
              location_name: c.description.slice(0, 30),
              latitude: c.latitude,
              longitude: c.longitude,
              zone: 'Central Commercial',
              waste_type: c.predicted_category,
              current_fill_percent: c.severity_level * 18,
              status: c.status === 'PENDING' ? 'CRITICAL' : 'NORMAL',
              priority_score: c.priority_score
            }))}
            height="460px"
          />

          {/* Ordered Stops Table (After Optimization) */}
          {optimizationResult && (
            <div className="dashboard-card" style={{ marginTop: '1rem', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--brand-emerald)" />
                <span>Optimized Dispatch Sequence</span>
              </h3>

              <div className="enterprise-table-wrapper">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Seq #</th>
                      <th>Tracking Code</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizationResult.ordered_stops.map((stop, idx) => (
                      <tr key={stop.complaint_id}>
                        <td>
                          <span style={{ 
                            background: '#059669', 
                            color: '#ffffff', 
                            borderRadius: '50%', 
                            width: 22, 
                            height: 22, 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 700, 
                            fontSize: '0.72rem' 
                          }}>
                            {stop.stop_sequence || idx + 1}
                          </span>
                        </td>
                        <td><b>{stop.tracking_number}</b></td>
                        <td>{stop.category}</td>
                        <td><b style={{ color: '#059669' }}>{stop.priority_score}</b></td>
                        <td>
                          <span className="status-pill emerald">Sequence Assigned</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Stop Selection & Parameters */}
        <div className="dashboard-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '0.92rem', margin: 0 }}>
              Select Candidate Stops ({selectedIds.size})
            </h3>
            <button className="btn-secondary btn-sm" onClick={handleSelectAllActive}>
              Select All Active
            </button>
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingRight: '0.2rem' }}>
            {complaints.map(comp => {
              const isChecked = selectedIds.has(comp.id);
              const isCrit = comp.priority_score >= 60;

              return (
                <div
                  key={comp.id}
                  onClick={() => handleToggleSelect(comp.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.55rem 0.65rem',
                    borderRadius: '6px',
                    border: `1px solid ${isChecked ? 'var(--brand-emerald)' : 'var(--border-light)'}`,
                    backgroundColor: isChecked ? 'var(--brand-emerald-subtle)' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <b style={{ color: 'var(--text-primary)' }}>{comp.tracking_number}</b>
                      <span className={`status-pill ${isCrit ? 'critical' : 'normal'}`} style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                        P: {comp.priority_score}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {comp.description.slice(0, 48)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Solver Parameters Accordion */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              OR-Tools Solver Parameters:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Vehicle Capacity (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={vehicleCapacityKg}
                  onChange={e => setVehicleCapacityKg(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Time (min/stop)</label>
                <input
                  type="number"
                  className="form-input"
                  value={avgServiceTimeMin}
                  onChange={e => setAvgServiceTimeMin(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
