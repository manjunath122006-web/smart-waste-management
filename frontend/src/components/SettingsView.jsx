import React, { useState } from 'react';
import { Settings, Save, MapPin, Gauge, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [depotName, setDepotName] = useState('Central Municipal Waste Depot');
  const [depotLat, setDepotLat] = useState('12.9716');
  const [depotLon, setDepotLon] = useState('77.5946');
  const [urbanSpeed, setUrbanSpeed] = useState('24.0');
  const [fuelRate, setFuelRate] = useState('0.28');
  const [fuelPrice, setFuelPrice] = useState('1.15');
  const [criticalThreshold, setCriticalThreshold] = useState('90');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Operations & Simulation Settings</h2>
          <p>
            Configure default depot dispatch coordinates, vehicular transit speed assumptions, fuel consumption benchmarks, and critical alarm thresholds.
          </p>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>Operational parameters saved to application state.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="dashboard-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Municipal Central Depot</h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Base location for OR-Tools combinatorial route initialization and vehicle return hub.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Hub Facility Name</label>
              <input type="text" className="form-input" value={depotName} onChange={e => setDepotName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Depot Latitude</label>
              <input type="text" className="form-input" value={depotLat} onChange={e => setDepotLat(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Depot Longitude</label>
              <input type="text" className="form-input" value={depotLon} onChange={e => setDepotLon(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Fleet Calculation & Simulation Benchmarks</h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Parameters used for ETA estimation, fuel savings computations, and carbon emission abatement (SDG 11.6).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Average Urban Transit Speed (km/h)</label>
              <input type="number" step="0.5" className="form-input" value={urbanSpeed} onChange={e => setUrbanSpeed(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Consumption Rate (L/km)</label>
              <input type="number" step="0.01" className="form-input" value={fuelRate} onChange={e => setFuelRate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Diesel Price Index ($/L)</label>
              <input type="number" step="0.05" className="form-input" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Critical Overflow Threshold (% Fill)</label>
              <input type="number" className="form-input" value={criticalThreshold} onChange={e => setCriticalThreshold(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
