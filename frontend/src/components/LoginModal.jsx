import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@ecoroute.local');
  const [password, setPassword] = useState('AdminSecurePass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--brand-emerald)" />
            <h3 style={{ margin: 0 }}>Municipal Operations Login</h3>
          </div>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Access authorized triage status overrides, route dispatch solvers, and fleet reassignments.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: 6, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} color="var(--text-dim)" style={{ position: 'absolute', left: 10, top: 11 }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2rem', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} color="var(--text-dim)" style={{ position: 'absolute', left: 10, top: 11 }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2rem', width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Demo credentials: <code>admin@ecoroute.local</code> / <code>AdminSecurePass123!</code>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
