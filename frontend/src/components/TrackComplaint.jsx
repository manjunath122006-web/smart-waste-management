import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { trackComplaint } from '../services/api';

export default function TrackComplaint({ initialTrackingId }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTrackingId) {
      handleSearch(initialTrackingId);
    }
  }, [initialTrackingId]);

  const handleSearch = async (idToSearch) => {
    const id = idToSearch || trackingId;
    if (!id || !id.trim()) {
      setError('Please enter a valid tracking number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await trackComplaint(id.trim());
      setComplaint(data);
    } catch (err) {
      setError(err.message || 'No complaint found matching this tracking ID.');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (score) => {
    if (score >= 70) return 'badge-critical';
    if (score >= 45) return 'badge-warning';
    return 'badge-normal';
  };

  const getStatusStepIndex = (status) => {
    const map = { PENDING: 1, ASSIGNED: 2, IN_PROGRESS: 3, RESOLVED: 4, REJECTED: 0 };
    return map[status] || 1;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h1 className="section-title">Track Complaint Status</h1>
        <p className="section-subtitle">
          Transparent real-time tracking of reported waste incidents and municipal collection progress.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ display: 'flex', gap: '0.75rem' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="var(--text-dim)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              placeholder="ENTER TRACKING NUMBER (E.G. CMP-20261026-A101)..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertTriangle size={20} />
          <div>{error}</div>
        </div>
      )}

      {complaint && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tracking ID</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-emerald)', letterSpacing: '0.04em' }}>
                {complaint.tracking_number}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`badge ${getPriorityBadgeClass(complaint.priority_score)}`}>
                Priority Score: {complaint.priority_score}
              </span>
              <span className="badge badge-info">{complaint.status}</span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              COLLECTION PROGRESS TIMELINE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {['Report Ingested', 'AI Verified & Prioritized', 'Route Assigned', 'Resolved'].map((label, idx) => {
                const currentStep = getStatusStepIndex(complaint.status);
                const isPassed = currentStep >= idx + 1;
                return (
                  <div key={label} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isPassed ? 'var(--primary-emerald)' : 'rgba(255,255,255,0.1)',
                        color: isPassed ? '#052117' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        margin: '0 auto 0.4rem',
                        boxShadow: isPassed ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isPassed ? 'var(--text-main)' : 'var(--text-dim)' }}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>REPORTED DESCRIPTION</div>
                <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: '0.2rem' }}>{complaint.description}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>CATEGORY</div>
                  <div style={{ fontWeight: 600 }}>{complaint.predicted_category.replace('_', ' ').toUpperCase()}</div>
                  {complaint.is_user_overridden && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--cyan-accent)' }}>(User Overridden)</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI CONFIDENCE</div>
                  <div style={{ fontWeight: 600 }}>{Math.round(complaint.confidence_score * 100)}%</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>COORDINATES</div>
                  <div style={{ fontSize: '0.85rem' }}>{complaint.latitude}, {complaint.longitude}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SUBMISSION DATE</div>
                  <div style={{ fontSize: '0.85rem' }}>{new Date(complaint.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Photo preview */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                SUBMITTED PHOTOGRAPHIC EVIDENCE
              </div>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '200px', background: '#000' }}>
                <img
                  src={complaint.image_url}
                  alt="Incident evidence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
