import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { submitComplaint, fetchCategories } from '../services/api';

export default function CitizenPortal({ onComplaintSubmitted, onTrackNow }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('12.9720');
  const [longitude, setLongitude] = useState('77.5950');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [manualCategory, setManualCategory] = useState('');
  
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (.jpg, .png, .webp).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
      },
      (err) => {
        setErrorMessage(`Location access error: ${err.message}. Using default coordinates.`);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Photographic evidence is mandatory for AI waste verification.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the waste accumulation.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('photo', selectedFile);
      if (manualCategory) formData.append('manual_category', manualCategory);
      if (email.trim()) formData.append('reported_by_email', email.trim());

      const res = await submitComplaint(formData);
      setSubmittedData(res);
      if (onComplaintSubmitted) onComplaintSubmitted(res);
      // Reset inputs
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setManualCategory('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h1 className="section-title">Report Municipal Waste Incident</h1>
        <p className="section-subtitle">
          Empowering citizens with AI visual verification & algorithmic collection optimization to support SDG 11.6.
        </p>
      </div>

      {submittedData && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckCircle2 color="var(--primary-emerald)" size={28} />
            <h2 style={{ fontSize: '1.35rem', color: '#fff' }}>Complaint Successfully Registered!</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Your photographic report has been ingested, classified by our AI computer vision engine, and ranked into the municipal collection queue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TRACKING ID</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-emerald)', letterSpacing: '0.04em' }}>
                {submittedData.tracking_number}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI PREDICTION</div>
              <div style={{ fontWeight: 600 }}>{submittedData.predicted_category.replace('_', ' ').toUpperCase()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence: {Math.round(submittedData.confidence_score * 100)}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>INITIAL PRIORITY</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: submittedData.priority_score >= 70 ? 'var(--priority-critical)' : 'var(--priority-warning)' }}>
                {submittedData.priority_score} / 100
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>STATUS</div>
              <span className="badge badge-warning">{submittedData.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => onTrackNow(submittedData.tracking_number)}>
              Track Status Live
            </button>
            <button className="btn btn-secondary" onClick={() => setSubmittedData(null)}>
              Submit Another Report
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
        {/* Upload & Preview */}
        <div className="form-group">
          <label className="form-label">
            1. Capture or Upload Waste Photograph <span style={{ color: 'var(--priority-critical)' }}>*</span>
          </label>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => document.getElementById('waste-file-input').click()}
          >
            <input
              id="waste-file-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div>
                <img
                  src={previewUrl}
                  alt="Waste Preview"
                  style={{ maxHeight: '220px', borderRadius: 'var(--radius-md)', margin: '0 auto', display: 'block', objectFit: 'cover' }}
                />
                <div style={{ marginTop: '0.75rem', color: 'var(--primary-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <Sparkles size={16} /> Image Loaded for MobileNetV2 Analysis (Click to change)
                </div>
              </div>
            ) : (
              <div>
                <Camera size={36} color="var(--primary-emerald)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Click to select photo or snap with camera</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Supports JPEG, PNG, WebP up to 10 MB
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            2. Incident Description <span style={{ color: 'var(--priority-critical)' }}>*</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Describe the issue (e.g. Overflowing dumpster at market corner, bad odor, blocking sidewalk)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* Location GPS */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              3. Geolocation Coordinates <span style={{ color: 'var(--priority-critical)' }}>*</span>
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              onClick={handleDetectLocation}
              disabled={isLocating}
            >
              <MapPin size={13} />
              {isLocating ? 'Detecting...' : 'Use My GPS Location'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input
              type="number"
              step="0.000001"
              className="form-input"
              placeholder="Latitude (e.g. 12.9716)"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.000001"
              className="form-input"
              placeholder="Longitude (e.g. 77.5946)"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Optional Manual Override or Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Manual Category Override (Optional)</label>
            <select
              className="form-select"
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value)}
            >
              <option value="">Let AI Auto-Classify (Recommended)</option>
              {categories.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.display_name} (Severity {c.default_severity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Citizen Email (For Updates)</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <RefreshCw size={18} className="spin-animation" />
              Processing Image & Ingesting to AWS Queue...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Incident for AI Verification
            </>
          )}
        </button>
      </form>
    </div>
  );
}
