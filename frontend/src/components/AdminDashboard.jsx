import React, { useState, useEffect } from 'react';
import { 
  BarChart3, CheckCircle, Clock, AlertTriangle, Flame, 
  Filter, RefreshCw, Edit2, ArrowRightCircle, ExternalLink 
} from 'lucide-react';
import { 
  fetchDashboardSummary, fetchComplaints, fetchHotspots, 
  updateComplaintStatus, overrideComplaint, fetchCategories 
} from '../services/api';

export default function AdminDashboard({ onSelectForRouting, token }) {
  const [summary, setSummary] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Selection for batch route planning
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Quick status update state
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumData, compData, hotData, catData] = await Promise.all([
        fetchDashboardSummary(),
        fetchComplaints({ status: statusFilter, category: categoryFilter }),
        fetchHotspots(),
        fetchCategories()
      ]);
      setSummary(sumData);
      setComplaints(compData);
      setHotspots(hotData);
      setCategories(catData);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter]);

  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      await updateComplaintStatus(complaintId, newStatus, token);
      await loadData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOverrideCategory = async (complaintId, currentCode) => {
    const newCode = prompt(`Enter new waste category code (overflowing_bin, mixed_waste, recyclable_waste, other):`, currentCode);
    if (!newCode || newCode === currentCode) return;
    try {
      await overrideComplaint(complaintId, { category_code: newCode });
      await loadData();
    } catch (err) {
      alert(`Override failed: ${err.message}`);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAllPending = () => {
    const pendingIds = complaints.filter(c => c.status !== 'RESOLVED').map(c => c.id);
    setSelectedIds(new Set(pendingIds));
  };

  const getPriorityBadgeClass = (score) => {
    if (score >= 70) return 'badge-critical';
    if (score >= 45) return 'badge-warning';
    return 'badge-normal';
  };

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Municipal Operations Dashboard</h1>
          <p className="section-subtitle">
            Centralized telemetry, priority ranking, and automated triage for urban waste logistics.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <div className="stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <div className="stat-value">{summary.total_complaints}</div>
              <div className="stat-label">Total Reports Ingested</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{summary.pending_complaints}</div>
              <div className="stat-label">Pending Triage</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="stat-value">{summary.resolved_complaints}</div>
              <div className="stat-label">Resolved & Cleaned</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon-box" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
              <Flame size={24} />
            </div>
            <div>
              <div className="stat-value">{summary.hotspot_count}</div>
              <div className="stat-label">Active Hotspot Zones</div>
            </div>
          </div>
        </div>
      )}

      {/* Hotspots Callout */}
      {hotspots.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Flame color="var(--priority-critical)" size={20} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>High Density Waste Hotspots Detected (250m Proximity)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {hotspots.map((h, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Cluster #{i + 1} ({h.complaint_count} complaints)</span>
                  <span className="badge badge-critical">Max Priority: {h.max_priority}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  Center: {h.center_latitude}, {h.center_longitude}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Action Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-dim)" />
          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.code} value={c.code}>{c.display_name}</option>
            ))}
          </select>

          <button className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }} onClick={selectAllPending}>
            Select All Unresolved ({complaints.filter(c => c.status !== 'RESOLVED').length})
          </button>
        </div>

        {selectedIds.size > 0 && (
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => onSelectForRouting(Array.from(selectedIds))}
          >
            <ArrowRightCircle size={18} />
            Optimize Route with {selectedIds.size} Selected Stops
          </button>
        )}
      </div>

      {/* Complaints Table */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Select</th>
                <th>Tracking ID</th>
                <th>Category (AI Verified)</th>
                <th>Priority Score</th>
                <th>Coordinates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No complaints matching current filters.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(c.id)} 
                        onChange={() => toggleSelect(c.id)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary-emerald)' }}>{c.tracking_number}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {c.description.slice(0, 40)}...
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{c.predicted_category.replace('_', ' ').toUpperCase()}</span>
                        <button
                          title="Override AI category"
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                          onClick={() => handleOverrideCategory(c.id, c.predicted_category)}
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Conf: {Math.round(c.confidence_score * 100)}% {c.is_user_overridden && '• Overridden'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadgeClass(c.priority_score)}`}>
                        {c.priority_score}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</div>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                        value={c.status}
                        disabled={updatingId === c.id}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td>
                      <a 
                        href={c.image_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                      >
                        <ExternalLink size={12} /> Photo
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
