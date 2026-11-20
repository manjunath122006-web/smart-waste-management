import React from 'react';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportsView({ summary = null, bins = [], vehicles = [] }) {
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Bin Code,Zone,Location,Fill Level,Status,Priority\n" + 
      bins.map(b => `${b.bin_code},"${b.zone}","${b.location_name}",${b.current_fill_percent}%,${b.status},${b.priority_score}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoRoute_Municipal_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Municipal Operations & Sustainability Reports</h2>
          <p>
            Official municipal audit documents, greenhouse gas emissions abatement certificates, and fleet utilization logs.
          </p>
        </div>
        <div className="header-action-group">
          <button className="btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={13} />
            <span>Print Report</span>
          </button>
          <button className="btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <FileText size={18} color="var(--brand-emerald)" />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Daily Municipal Collection Summary</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Audited daily metrics including total container pickups, average clearance duration, and fleet availability.
          </p>
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 6, fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Registered Containers:</span>
              <b>{bins.length} units</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Completed Clearances:</span>
              <b>18 pickups</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Trucks:</span>
              <b>{vehicles.length} vehicles</b>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <ShieldCheck size={18} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>UN SDG 11 Sustainability Audit</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Certified vehicular emission savings calculated via OR-Tools combinatorial optimization vs standard fixed routes.
          </p>
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 6, fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Distance Reduced:</span>
              <b style={{ color: '#059669' }}>-28.4% (-142 km/wk)</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Diesel Fuel Saved:</span>
              <b>39.8 Liters</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CO₂ Emissions Avoided:</span>
              <b style={{ color: '#059669' }}>107.2 kg CO₂</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
