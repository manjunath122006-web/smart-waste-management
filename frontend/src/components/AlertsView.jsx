import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Clock, Trash2, Truck } from 'lucide-react';

export default function AlertsView() {
  const [alerts, setAlerts] = useState([
    { id: 'ALT-901', type: 'CRITICAL', title: 'Critical Overflow: BIN-101 (94% Fill)', location: 'MG Road Metro Concourse', time: '12 mins ago', details: 'Ultrasonic sensor triggered critical threshold. Immediate dispatch required.', acknowledged: false },
    { id: 'ALT-902', type: 'CRITICAL', title: 'Critical Overflow: BIN-201 (98% Fill)', location: 'Russell Market Wholesale Bay', time: '24 mins ago', details: 'Wet organic waste overflow reported by optical AI camera.', acknowledged: false },
    { id: 'ALT-903', type: 'WARNING', title: 'Vehicle Delay Alert: TRK-02', location: 'East Market Corridor', time: '35 mins ago', details: 'Heavy commercial traffic congestion causing 18-minute delay on Stop #3.', acknowledged: false },
    { id: 'ALT-904', type: 'WARNING', title: 'High Fill Level: BIN-301 (89% Fill)', location: 'Malleshwaram 8th Cross Park', time: '1 hour ago', details: 'Sensor reading exceeds warning threshold of 75%. Assigned to afternoon shift.', acknowledged: true },
    { id: 'ALT-905', type: 'INFO', title: 'Sensor Battery Low: IOT-SENS-201', location: 'Russell Market Wholesale Bay', time: '3 hours ago', details: 'Internal lithium cell dropped below 80%. Maintenance scheduled for weekend.', acknowledged: true }
  ]);

  const toggleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Active Threshold Alerts & Automated Triggers</h2>
          <p>
            Real-time incident stream monitoring container overflows, sensor telemetry anomalies, and vehicular transit delays.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {alerts.map(alert => {
          const isCrit = alert.type === 'CRITICAL';
          const isWarn = alert.type === 'WARNING';
          const borderClr = isCrit ? '#fecaca' : isWarn ? '#fed7aa' : '#e2e8f0';
          const bgClr = alert.acknowledged ? '#ffffff' : (isCrit ? '#fef2f2' : isWarn ? '#fff7ed' : '#ffffff');

          return (
            <div 
              key={alert.id} 
              className="dashboard-card" 
              style={{ padding: '1rem 1.25rem', borderColor: borderClr, backgroundColor: bgClr }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  {isCrit ? (
                    <AlertCircle size={20} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
                  ) : isWarn ? (
                    <AlertTriangle size={20} color="#ea580c" style={{ marginTop: 2, flexShrink: 0 }} />
                  ) : (
                    <Bell size={20} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <b style={{ fontSize: '0.9rem', color: isCrit ? '#dc2626' : 'var(--text-primary)' }}>
                        {alert.title}
                      </b>
                      <span className={`status-pill ${isCrit ? 'critical' : isWarn ? 'warning' : 'gray'}`}>
                        {alert.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📍 {alert.location} • <span style={{ color: 'var(--text-dim)' }}>{alert.time}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {alert.details}
                    </div>
                  </div>
                </div>

                <button 
                  className={`btn-sm ${alert.acknowledged ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ alignSelf: 'center' }}
                  onClick={() => toggleAcknowledge(alert.id)}
                >
                  {alert.acknowledged ? 'Acknowledged ✓' : 'Acknowledge Alert'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
