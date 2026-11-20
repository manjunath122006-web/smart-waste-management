import React from 'react';
import { BarChart3, TrendingUp, Leaf, Award, PieChart, ShieldCheck, MapPin } from 'lucide-react';

export default function WasteAnalyticsView({ summary = null, bins = [], vehicles = [] }) {
  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>Municipal Waste Analytics & SDG 11 Intelligence</h2>
          <p>
            Macro-level waste stream analytics, combinatorial routing emissions reduction, and municipal compliance with UN Sustainable Development Goal 11.6.
          </p>
        </div>
      </div>

      {/* SDG 11.6 Impact Banner */}
      <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--brand-emerald)', backgroundColor: '#ecfdf5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Leaf size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
              UN SDG 11.6 Target: Reduce the Adverse Per Capita Environmental Impact of Cities
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '2px' }}>
              Target 11.6.1: Proportion of municipal solid waste collected and managed in controlled facilities with minimal vehicular emissions.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Macro Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="dashboard-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly Tonnage Collected</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>130.4 MT</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>+6.2% vs previous week</div>
        </div>

        <div className="dashboard-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR-Tools Transit Savings</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#059669', margin: '4px 0' }}>-28.4% km</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>142.6 km avoided weekly</div>
        </div>

        <div className="dashboard-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avoided CO₂ Urban Emissions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2563eb', margin: '4px 0' }}>107.2 kg CO₂</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Calibrated 2.68 kg/L diesel factor</div>
        </div>

        <div className="dashboard-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Resolution Duration</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
            {summary?.average_resolution_hours || 4.2}h
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Within 6h municipal SLA</div>
        </div>
      </div>

      {/* Waste Stream Categories Breakdown */}
      <div className="dashboard-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Municipal Waste Stream Material Segmentation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wet Organic Food Waste</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', margin: '2px 0' }}>54.2 MT (41.5%)</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Diverted to Municipal Bio-Methanation</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dry Recyclables (Plastic/Paper)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb', margin: '2px 0' }}>38.6 MT (29.6%)</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Channeled to Material Recovery Facilities</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mixed Solid Municipal Waste</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ea580c', margin: '2px 0' }}>29.1 MT (22.3%)</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Sanitary Engineered Landfill Processing</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Construction & Bulky Debris</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748b', margin: '2px 0' }}>8.5 MT (6.6%)</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Crushed for Aggregate Base Reuse</div>
          </div>
        </div>
      </div>
    </div>
  );
}
