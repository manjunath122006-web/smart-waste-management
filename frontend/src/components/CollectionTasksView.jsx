import React, { useState } from 'react';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, Truck, MapPin, Search } from 'lucide-react';

export default function CollectionTasksView({ vehicles = [], bins = [] }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample tasks combined from vehicles and critical bins
  const tasks = [
    { id: 'TSK-101', stopNum: 1, vehicle: 'TRK-01', location: 'MG Road Metro Station', zone: 'Central Commercial', status: 'COMPLETED', time: '08:15 AM', type: 'Container Emptying', loadKg: 950 },
    { id: 'TSK-102', stopNum: 2, vehicle: 'TRK-01', location: 'Brigade Road Crossing', zone: 'Central Commercial', status: 'COMPLETED', time: '08:42 AM', type: 'Recyclables Bin', loadKg: 620 },
    { id: 'TSK-103', stopNum: 3, vehicle: 'TRK-01', location: 'Commercial Street Alley', zone: 'Central Commercial', status: 'IN_PROGRESS', time: '09:10 AM', type: 'Commercial Dumpster', loadKg: 1200 },
    { id: 'TSK-104', stopNum: 4, vehicle: 'TRK-01', location: 'Cubbon Park North Gate', zone: 'Central Commercial', status: 'PENDING', time: '09:45 AM', type: 'Park Organic Bin', loadKg: 450 },
    { id: 'TSK-201', stopNum: 1, vehicle: 'TRK-02', location: 'Russell Market Wholesale Bay', zone: 'East Market', status: 'COMPLETED', time: '07:30 AM', type: 'Wet Organic Waste', loadKg: 2200 },
    { id: 'TSK-202', stopNum: 2, vehicle: 'TRK-02', location: 'Shivajinagar Bus Terminus', zone: 'East Market', status: 'DELAYED', time: '08:50 AM', type: 'Transit Mixed Waste', loadKg: 1600 },
    { id: 'TSK-301', stopNum: 1, vehicle: 'TRK-03', location: 'Malleshwaram 8th Cross', zone: 'West Residential', status: 'COMPLETED', time: '08:00 AM', type: 'Residential Bin', loadKg: 780 },
    { id: 'TSK-302', stopNum: 2, vehicle: 'TRK-03', location: 'Sampige Road Market', zone: 'West Residential', status: 'IN_PROGRESS', time: '09:20 AM', type: 'Market General Waste', loadKg: 1100 }
  ];

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.vehicle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Municipal Collection Tasks & Driver Logs</h2>
          <p>
            Real-time execution ledger of assigned route stops, driver check-ins, visited timestamps, and collection confirmations.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dashboard-card" style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2rem', width: '100%' }}
              placeholder="Search task ID, location or vehicle..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Task Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DELAYED">Delayed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Assigned Vehicle</th>
              <th>Stop Sequence</th>
              <th>Location & Zone</th>
              <th>Task Type</th>
              <th>Est. Weight Cleared</th>
              <th>Scheduled Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(t => (
              <tr key={t.id}>
                <td><b>{t.id}</b></td>
                <td>
                  <span className="status-pill blue">
                    <Truck size={12} />
                    <span>{t.vehicle}</span>
                  </span>
                </td>
                <td>
                  <span style={{ background: '#f1f5f9', fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>
                    Stop #{t.stopNum}
                  </span>
                </td>
                <td>
                  <div>{t.location}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{t.zone}</div>
                </td>
                <td>{t.type}</td>
                <td><b>{t.loadKg} kg</b></td>
                <td>{t.time}</td>
                <td>
                  <span className={`status-pill ${t.status === 'COMPLETED' ? 'emerald' : t.status === 'IN_PROGRESS' ? 'blue' : t.status === 'DELAYED' ? 'critical' : 'warning'}`}>
                    {t.status}
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
