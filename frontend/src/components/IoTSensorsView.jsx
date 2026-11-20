import React, { useState } from 'react';
import { Cpu, Wifi, Battery, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function IoTSensorsView({ bins = [] }) {
  const [sensors] = useState([
    { id: 'IOT-SENS-101', bin: 'BIN-101', location: 'MG Road Metro', type: 'Ultrasonic Distance', battery: 91, signal: -68, status: 'ONLINE', interval: '15m', lastPing: '2 mins ago' },
    { id: 'IOT-SENS-102', bin: 'BIN-102', location: 'Brigade Road Crossing', type: 'Ultrasonic Distance', battery: 88, signal: -72, status: 'ONLINE', interval: '15m', lastPing: '4 mins ago' },
    { id: 'IOT-SENS-103', bin: 'BIN-103', location: 'Cubbon Park North Gate', type: 'Optical Time-of-Flight', battery: 96, signal: -64, status: 'ONLINE', interval: '30m', lastPing: '8 mins ago' },
    { id: 'IOT-SENS-201', bin: 'BIN-201', location: 'Russell Market Bay', type: 'Ultrasonic Distance', battery: 79, signal: -81, status: 'WARNING', interval: '10m', lastPing: '1 min ago' },
    { id: 'IOT-SENS-202', bin: 'BIN-202', location: 'Commercial Street Alley', type: 'Ultrasonic Distance', battery: 84, signal: -70, status: 'ONLINE', interval: '15m', lastPing: '5 mins ago' },
    { id: 'IOT-SENS-301', bin: 'BIN-301', location: 'Malleshwaram 8th Cross', type: 'Optical Time-of-Flight', battery: 86, signal: -66, status: 'ONLINE', interval: '20m', lastPing: '11 mins ago' },
    { id: 'IOT-SENS-401', bin: 'BIN-401', location: 'Koramangala 5th Block', type: 'Ultrasonic Distance', battery: 89, signal: -74, status: 'ONLINE', interval: '15m', lastPing: '6 mins ago' }
  ]);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>IoT Sensors & Telemetry Pipeline</h2>
          <p>
            Simulated LoRaWAN / NB-IoT ultrasonic fill-level sensor telemetry stream, battery diagnostics, and network signal metrics.
          </p>
        </div>
      </div>

      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Sensor ID</th>
              <th>Container ID</th>
              <th>Location</th>
              <th>Sensor Transducer</th>
              <th>Battery Health</th>
              <th>Signal Strength (RSSI)</th>
              <th>Polling Cadence</th>
              <th>Last Transmission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(s => (
              <tr key={s.id}>
                <td><b>{s.id}</b></td>
                <td>{s.bin}</td>
                <td>{s.location}</td>
                <td>{s.type}</td>
                <td>
                  <span style={{ color: s.battery < 80 ? '#ea580c' : '#059669', fontWeight: 600 }}>
                    🔋 {s.battery}%
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace' }}>{s.signal} dBm</span>
                </td>
                <td>{s.interval}</td>
                <td>{s.lastPing}</td>
                <td>
                  <span className={`status-pill ${s.status === 'ONLINE' ? 'emerald' : 'warning'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
