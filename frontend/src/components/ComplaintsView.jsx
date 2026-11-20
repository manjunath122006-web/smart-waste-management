import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, Sparkles, Send, CheckCircle2, 
  AlertCircle, RefreshCw, Eye, Edit2, Search, Filter, 
  Clock, ShieldCheck, X 
} from 'lucide-react';
import { 
  submitComplaint, fetchComplaints, fetchCategories, 
  updateComplaintStatus, overrideComplaint, trackComplaint 
} from '../services/api';

export default function ComplaintsView({ token = '', onSelectForRouting = () => {} }) {
  const [activeTab, setActiveTab] = useState('admin-table'); // 'admin-table', 'submit-form', 'track-view'
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Submit form state
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('12.9750');
  const [longitude, setLongitude] = useState('77.5980');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [manualCategory, setManualCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [formError, setFormError] = useState('');

  // Tracking tab state
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Modal inspection
  const [inspectingComplaint, setInspectingComplaint] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compData, catData] = await Promise.all([
        fetchComplaints({ status: statusFilter }),
        fetchCategories()
      ]);
      setComplaints(compData);
      setCategories(catData);
    } catch (e) {
      console.error('Failed to load complaints', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please upload an image file (.jpg, .png, .webp).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormError('');
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation not supported by browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      (err) => {
        setFormError('Could not acquire location; default coordinates used.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFormError('Waste photograph upload is required for AI classification triage.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a brief description.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('photo', selectedFile);
      if (manualCategory) formData.append('manual_category', manualCategory);
      if (email) formData.append('reported_by_email', email);

      const res = await submitComplaint(formData);
      setSubmissionResult(res);
      // Reset form
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setManualCategory('');
      loadData();
    } catch (err) {
      setFormError(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumberInput.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    try {
      const res = await trackComplaint(trackingNumberInput.trim());
      setTrackedComplaint(res);
    } catch (err) {
      setTrackingError(err.message || 'Complaint not found');
      setTrackedComplaint(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaintStatus(id, status, token);
      loadData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return c.tracking_number.toLowerCase().includes(q) ||
             c.description.toLowerCase().includes(q) ||
             c.predicted_category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Citizen Complaints & AI Visual Classification</h2>
          <p>
            Municipal grievance management, automated triage via transfer-learning AI image classification, and routing dispatch.
          </p>
        </div>
        <div className="header-action-group">
          <button 
            className={`btn-secondary btn-sm ${activeTab === 'admin-table' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-table')}
          >
            Complaints Table
          </button>
          <button 
            className={`btn-primary btn-sm ${activeTab === 'submit-form' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit-form')}
          >
            <Camera size={14} />
            <span>Report Waste (Citizen)</span>
          </button>
          <button 
            className={`btn-secondary btn-sm ${activeTab === 'track-view' ? 'active' : ''}`}
            onClick={() => setActiveTab('track-view')}
          >
            Track Grievance
          </button>
        </div>
      </div>

      {/* TAB 1: ADMINISTRATIVE COMPLAINTS TABLE */}
      {activeTab === 'admin-table' && (
        <div>
          {/* Filter Bar */}
          <div className="dashboard-card" style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2rem', width: '100%' }}
                  placeholder="Search tracking number, category or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="form-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Complaint Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              <button className="btn-secondary btn-sm" onClick={loadData} disabled={loading}>
                <RefreshCw size={13} className={loading ? 'spin-anim' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="enterprise-table-wrapper">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Tracking #</th>
                  <th>Category (AI Classified)</th>
                  <th>Priority Score</th>
                  <th>Coordinates</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map(comp => {
                    const isCrit = comp.priority_score >= 60;
                    return (
                      <tr key={comp.id}>
                        <td>
                          <b>{comp.tracking_number}</b>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            {comp.reported_by_email || 'Public Citizen'}
                          </div>
                        </td>
                        <td>
                          <span className="status-pill gray" style={{ textTransform: 'capitalize' }}>
                            {comp.predicted_category.replace('_', ' ')}
                          </span>
                          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                            AI Conf: {Math.round(comp.confidence_score * 100)}%
                          </div>
                        </td>
                        <td>
                          <b style={{ color: isCrit ? '#dc2626' : 'var(--text-primary)' }}>
                            {comp.priority_score.toFixed(1)}
                          </b>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            Sev: {comp.severity_level}/5
                          </div>
                        </td>
                        <td>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                            {comp.latitude.toFixed(4)}, {comp.longitude.toFixed(4)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.74rem' }}>
                            {new Date(comp.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${comp.status === 'PENDING' ? 'warning' : comp.status === 'RESOLVED' ? 'emerald' : 'blue'}`}>
                            {comp.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem' }}
                            value={comp.status}
                            onChange={(e) => handleStatusChange(comp.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-secondary btn-sm"
                            onClick={() => setInspectingComplaint(comp)}
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN REPORT FORM & AI WASTE CLASSIFICATION */}
      {activeTab === 'submit-form' && (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="dashboard-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Report Urban Waste / Overflow</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Upload a photograph of overflowing bins or illegal waste piles. Our AI pipeline classifies waste type, computes priority, and routes dispatch.
            </p>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            {submissionResult && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Complaint Successfully Lodged</span>
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  Tracking Number: <b style={{ color: '#047857' }}>{submissionResult.tracking_number}</b>
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  AI Predicted Category: <b>{submissionResult.predicted_category}</b> ({Math.round(submissionResult.confidence_score * 100)}% confidence)
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Photo Upload & AI Preview */}
              <div className="form-group">
                <label className="form-label">Waste Incident Photograph (Required for AI)</label>
                <div style={{ 
                  border: '2px dashed var(--border-light)', 
                  borderRadius: '8px', 
                  padding: '1.25rem', 
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}>
                  {previewUrl ? (
                    <div>
                      <img 
                        src={previewUrl} 
                        alt="Uploaded Waste" 
                        style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 6, marginBottom: '0.5rem' }} 
                      />
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                        ✓ Photograph Ready for MobileNetV2 / Heuristic Classification
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Camera size={32} color="var(--text-dim)" style={{ marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Click to select photo or capture image
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Supports JPG, PNG, WEBP (Max 10MB)
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="waste-file-input"
                  />
                  <label htmlFor="waste-file-input" className="btn-secondary btn-sm" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
                    Select Image File
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Incident Description & Landmarks</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g., Commercial dumpsters overflowing onto pedestrian sidewalk near station entrance..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Location Coordinates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={handleDetectLocation}
                style={{ alignSelf: 'flex-start' }}
              >
                <MapPin size={13} />
                <span>Detect My GPS Coordinates</span>
              </button>

              {/* Manual Category Override Option (Human In The Loop) */}
              <div className="form-group">
                <label className="form-label">Manual Category Override (Optional Human Correction)</label>
                <select
                  className="form-select"
                  value={manualCategory}
                  onChange={e => setManualCategory(e.target.value)}
                >
                  <option value="">Auto-Detect via AI Engine</option>
                  <option value="overflowing_bin">Overflowing Garbage Bin</option>
                  <option value="mixed_waste">Mixed Unsorted Waste Pile</option>
                  <option value="recyclable_waste">Accumulated Recyclable Waste</option>
                  <option value="other">General / Other Urban Waste</option>
                </select>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  If left blank, our AI model will automatically determine waste category and priority level.
                </span>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Citizen Email (For Resolution Updates)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
                style={{ justifyContent: 'center', padding: '0.65rem' }}
              >
                <Send size={15} />
                <span>{isSubmitting ? 'Ingesting & Classifying...' : 'Submit Grievance to Municipal Triage'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: TRACK COMPLAINT */}
      {activeTab === 'track-view' && (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div className="dashboard-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Track Grievance Status</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter the unique tracking code issued upon reporting (e.g., CMP-20261026-A101).
            </p>

            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Enter tracking number (e.g. CMP-20261026-A101)..."
                value={trackingNumberInput}
                onChange={e => setTrackingNumberInput(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={trackingLoading}>
                <Search size={14} />
                <span>{trackingLoading ? 'Searching...' : 'Track'}</span>
              </button>
            </form>

            {trackingError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                {trackingError}
              </div>
            )}

            {trackedComplaint && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <b style={{ fontSize: '0.95rem' }}>{trackedComplaint.tracking_number}</b>
                  <span className={`status-pill ${trackedComplaint.status === 'RESOLVED' ? 'emerald' : 'warning'}`}>
                    {trackedComplaint.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {trackedComplaint.description}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem' }}>
                  <div>Category: <b>{trackedComplaint.predicted_category}</b></div>
                  <div>AI Confidence: <b>{Math.round(trackedComplaint.confidence_score * 100)}%</b></div>
                  <div>Severity Level: <b>{trackedComplaint.severity_level}/5</b></div>
                  <div>Priority Score: <b style={{ color: '#059669' }}>{trackedComplaint.priority_score}</b></div>
                </div>

                {trackedComplaint.image_url && (
                  <div style={{ marginTop: '0.85rem' }}>
                    <img 
                      src={trackedComplaint.image_url} 
                      alt="Incident Evidence" 
                      style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, objectFit: 'cover' }} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complaint Inspection Modal */}
      {inspectingComplaint && (
        <div className="modal-backdrop" onClick={() => setInspectingComplaint(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Grievance #{inspectingComplaint.tracking_number}</h3>
              <button className="btn-icon-only" onClick={() => setInspectingComplaint(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <b>{inspectingComplaint.predicted_category}</b>
                </div>
                <div>
                  <label className="form-label">AI Confidence</label>
                  <b style={{ color: '#059669' }}>{Math.round(inspectingComplaint.confidence_score * 100)}%</b>
                </div>
                <div>
                  <label className="form-label">Current Status</label>
                  <span className="status-pill emerald">{inspectingComplaint.status}</span>
                </div>
                <div>
                  <label className="form-label">Priority Triage Score</label>
                  <b>{inspectingComplaint.priority_score}</b>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  {inspectingComplaint.description}
                </div>
              </div>

              {inspectingComplaint.image_url && (
                <div>
                  <label className="form-label">Visual Evidence</label>
                  <img 
                    src={inspectingComplaint.image_url} 
                    alt="Complaint Evidence"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 6 }}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setInspectingComplaint(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
