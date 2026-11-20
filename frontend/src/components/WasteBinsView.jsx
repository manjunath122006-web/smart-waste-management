import React, { useState } from 'react';
import { 
  Trash2, Search, Filter, RefreshCw, Eye, Edit2, 
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { updateBin } from '../services/api';

export default function WasteBinsView({
  bins = [],
  onRefresh = () => {},
  loading = false,
  activeZone = 'ALL'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState(activeZone === 'ALL' ? '' : activeZone);
  const [wasteTypeFilter, setWasteTypeFilter] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filtered = bins.filter(b => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = b.bin_code.toLowerCase().includes(q) ||
                    b.location_name.toLowerCase().includes(q) ||
                    b.zone.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter && b.status !== statusFilter) return false;
    if (zoneFilter && b.zone !== zoneFilter) return false;
    if (wasteTypeFilter && b.waste_type !== wasteTypeFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedBins = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSimulateFillChange = async (binId, newPct) => {
    try {
      await updateBin(binId, { current_fill_percent: parseFloat(newPct) });
      onRefresh();
      if (selectedBin && selectedBin.id === binId) {
        setSelectedBin(prev => ({ ...prev, current_fill_percent: parseFloat(newPct) }));
      }
    } catch (e) {
      alert(`Update failed: ${e.message}`);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Waste Bins Registry & Sensor Telemetry</h2>
          <p>
            Municipal container tracking, ultrasonic fill-level telemetry (simulated), and collection priority ranking.
          </p>
        </div>
        <div className="header-action-group">
          <button className="btn-secondary btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Refresh Bins</span>
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
              placeholder="Search by bin code, location or street..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <select 
            className="form-select"
            value={zoneFilter}
            onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Zones</option>
            <option value="Central Commercial">Central Commercial (Zone A)</option>
            <option value="East Market">East Market (Zone B)</option>
            <option value="West Residential">West Residential (Zone C)</option>
            <option value="South Suburbs">South Suburbs (Zone D)</option>
          </select>

          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="CRITICAL">Critical (&gt;90%)</option>
            <option value="WARNING">Warning (75-89%)</option>
            <option value="NORMAL">Normal (&lt;75%)</option>
            <option value="COLLECTING">In Collection</option>
          </select>

          <select 
            className="form-select"
            value={wasteTypeFilter}
            onChange={(e) => { setWasteTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Waste Types</option>
            <option value="general">General Waste</option>
            <option value="recyclable">Recyclable</option>
            <option value="organic">Organic Waste</option>
          </select>

          {(searchTerm || statusFilter || zoneFilter || wasteTypeFilter) && (
            <button 
              className="btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setZoneFilter('');
                setWasteTypeFilter('');
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Location</th>
              <th>Zone</th>
              <th>Waste Category</th>
              <th>Fill Level (Simulated)</th>
              <th>Priority Score</th>
              <th>Status</th>
              <th>Assigned Route</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedBins.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No waste bins match the active search or filter criteria.
                </td>
              </tr>
            ) : (
              pagedBins.map(bin => {
                const isCritical = bin.status === 'CRITICAL' || bin.current_fill_percent >= 90;
                const isWarning = bin.status === 'WARNING' || (bin.current_fill_percent >= 75 && bin.current_fill_percent < 90);
                const fillColor = isCritical ? '#dc2626' : isWarning ? '#ea580c' : '#10b981';

                return (
                  <tr key={bin.id}>
                    <td>
                      <b style={{ color: 'var(--text-primary)' }}>{bin.bin_code}</b>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {bin.sensor_id || 'Virtual Sensor'}
                      </div>
                    </td>
                    <td>
                      <div>{bin.location_name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}
                      </div>
                    </td>
                    <td>{bin.zone}</td>
                    <td>
                      <span className="status-pill gray" style={{ textTransform: 'capitalize' }}>
                        {bin.waste_type}
                      </span>
                    </td>
                    <td>
                      <div className="fill-bar-wrapper">
                        <div className="fill-bar-track">
                          <div 
                            className="fill-bar-fill" 
                            style={{ width: `${Math.min(100, bin.current_fill_percent)}%`, backgroundColor: fillColor }}
                          />
                        </div>
                        <span className="fill-bar-text" style={{ color: fillColor }}>
                          {Math.round(bin.current_fill_percent)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <b style={{ color: isCritical ? '#dc2626' : 'var(--text-primary)' }}>
                        {bin.priority_score.toFixed(1)}
                      </b>
                    </td>
                    <td>
                      <span className={`status-pill ${isCritical ? 'critical' : isWarning ? 'warning' : 'normal'}`}>
                        {bin.status}
                      </span>
                    </td>
                    <td>
                      {bin.assigned_route_id ? (
                        <span className="status-pill blue">Route Assigned</span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => setSelectedBin(bin)}
                        title="View Bin Sensor Details"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div>
          Showing {Math.min(filtered.length, (page - 1) * pageSize + 1)} to {Math.min(filtered.length, page * pageSize)} of {filtered.length} bins
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button 
            className="btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            className="btn-secondary btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Bin Detail Modal / Inspection Drawer */}
      {selectedBin && (
        <div className="modal-backdrop" onClick={() => setSelectedBin(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={18} color="var(--brand-emerald)" />
                <h3 style={{ margin: 0 }}>Bin Telemetry Inspection: {selectedBin.bin_code}</h3>
              </div>
              <button className="btn-icon-only" onClick={() => setSelectedBin(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Container Code</label>
                  <div style={{ fontWeight: 600 }}>{selectedBin.bin_code}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Operational Zone</label>
                  <div>{selectedBin.zone}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location Address</label>
                  <div>{selectedBin.location_name}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">GPS Coordinates</label>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {selectedBin.latitude}, {selectedBin.longitude}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Waste Type / Capacity</label>
                  <div style={{ textTransform: 'capitalize' }}>
                    {selectedBin.waste_type} ({selectedBin.capacity_liters} Liters)
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">IoT Sensor Battery</label>
                  <div style={{ color: '#059669', fontWeight: 600 }}>
                    🔋 {selectedBin.sensor_battery_percent}% (Normal)
                  </div>
                </div>
              </div>

              {/* Simulated Sensor Control Slider */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Simulate Ultrasonic Fill Level Sensor:
                  </label>
                  <b style={{ color: selectedBin.current_fill_percent >= 90 ? '#dc2626' : '#059669', fontSize: '1rem' }}>
                    {selectedBin.current_fill_percent}%
                  </b>
                </div>

                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={selectedBin.current_fill_percent}
                  onChange={(e) => handleSimulateFillChange(selectedBin.id, e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                  <span>0% (Empty)</span>
                  <span>75% (Warning)</span>
                  <span>90% (Critical Overflow)</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setSelectedBin(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
