import React, { useState } from 'react';
import { 
  Truck, Search, Filter, RefreshCw, Eye, Edit2, 
  CheckCircle2, AlertCircle, Fuel, BatteryCharging, X, User 
} from 'lucide-react';
import { updateVehicle } from '../services/api';

export default function VehiclesView({
  vehicles = [],
  routes = [],
  onRefresh = () => {},
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const filtered = vehicles.filter(v => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = v.vehicle_code.toLowerCase().includes(q) ||
                    v.driver_name.toLowerCase().includes(q) ||
                    v.model.toLowerCase().includes(q) ||
                    v.plate_number.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter && v.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (vehicleId, status) => {
    try {
      await updateVehicle(vehicleId, { status });
      setEditingVehicle(null);
      onRefresh();
    } catch (e) {
      alert(`Vehicle update failed: ${e.message}`);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Fleet Vehicle Management & Dispatch Control</h2>
          <p>
            Municipal collection truck fleet, payload telemetry, driver assignments, and live route status.
          </p>
        </div>
        <div className="header-action-group">
          <button className="btn-secondary btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Refresh Fleet</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="dashboard-card" style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2rem', width: '100%' }}
              placeholder="Search truck code, driver name, license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Fleet Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="COLLECTING">Collecting</option>
            <option value="STANDBY">Standby</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
        {filtered.map(veh => {
          const isEnRoute = veh.status === 'EN_ROUTE';
          const isCollecting = veh.status === 'COLLECTING';
          const isStandby = veh.status === 'STANDBY';
          const statusBadge = isEnRoute ? 'emerald' : isCollecting ? 'blue' : isStandby ? 'gray' : 'warning';
          
          const payloadPct = Math.round((veh.current_load_kg / veh.capacity_kg) * 100);
          const stopProgressPct = Math.round((veh.total_stops_completed / Math.max(1, veh.total_stops_assigned)) * 100);

          return (
            <div key={veh.id} className="dashboard-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={22} color="var(--brand-emerald)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{veh.vehicle_code}</h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {veh.plate_number} • {veh.model}
                    </div>
                  </div>
                </div>

                <span className={`status-pill ${statusBadge}`}>
                  {veh.status}
                </span>
              </div>

              {/* Driver & Type */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.65rem', marginBottom: '0.85rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Driver:</span>
                  <b style={{ color: 'var(--text-primary)' }}>{veh.driver_name}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                  <span>{veh.driver_phone || 'Radio Channel 4'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle Type:</span>
                  <span style={{ textTransform: 'capitalize' }}>{veh.vehicle_type}</span>
                </div>
              </div>

              {/* Payload Capacity Bar */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payload Weight:</span>
                  <b>{veh.current_load_kg} / {veh.capacity_kg} kg ({payloadPct}%)</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${payloadPct}%`, 
                      backgroundColor: payloadPct > 85 ? '#dc2626' : payloadPct > 60 ? '#ea580c' : '#059669' 
                    }} 
                  />
                </div>
              </div>

              {/* Stop Completion Progress */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stops Completed:</span>
                  <b>{veh.total_stops_completed} of {veh.total_stops_assigned} stops ({stopProgressPct}%)</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stopProgressPct}%`, backgroundColor: '#2563eb' }} 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#059669' }}>
                  <Fuel size={13} />
                  <span>Fuel: <b>{veh.fuel_level_percent}%</b></span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setEditingVehicle(veh);
                      setNewStatus(veh.status);
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Update Status</span>
                  </button>
                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => setSelectedVehicle(veh)}
                  >
                    <Eye size={13} />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Vehicle Status Modal */}
      {editingVehicle && (
        <div className="modal-backdrop" onClick={() => setEditingVehicle(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Update Vehicle: {editingVehicle.vehicle_code}</h3>
              <button className="btn-icon-only" onClick={() => setEditingVehicle(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Dispatch Status</label>
                <select 
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE — Ready for Dispatch</option>
                  <option value="EN_ROUTE">EN_ROUTE — Driving on Collection Route</option>
                  <option value="COLLECTING">COLLECTING — Emptying Bins</option>
                  <option value="STANDBY">STANDBY — Stationed at Depot</option>
                  <option value="MAINTENANCE">MAINTENANCE — Service Bay</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setEditingVehicle(null)}>
                Cancel
              </button>
              <button 
                className="btn-primary btn-sm"
                onClick={() => handleUpdateStatus(editingVehicle.id, newStatus)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="modal-backdrop" onClick={() => setSelectedVehicle(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Fleet Telemetry: {selectedVehicle.vehicle_code}</h3>
              <button className="btn-icon-only" onClick={() => setSelectedVehicle(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">License Plate</label>
                  <b>{selectedVehicle.plate_number}</b>
                </div>
                <div className="form-group">
                  <label className="form-label">Model Engine</label>
                  <div>{selectedVehicle.model}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Driver Name</label>
                  <div>{selectedVehicle.driver_name}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Driver Phone</label>
                  <div>{selectedVehicle.driver_phone}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Current GPS Coordinates</label>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {selectedVehicle.latitude}, {selectedVehicle.longitude}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Level</label>
                  <div style={{ color: '#059669', fontWeight: 600 }}>{selectedVehicle.fuel_level_percent}%</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setSelectedVehicle(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
