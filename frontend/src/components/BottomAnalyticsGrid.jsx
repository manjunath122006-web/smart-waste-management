import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Award, MapPin, Truck, Leaf, Activity } from 'lucide-react';

export default function BottomAnalyticsGrid({
  bins = [],
  vehicles = [],
  summary = null,
  activeZone = 'ALL'
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Filtered counts
  const filteredBins = bins.filter(b => activeZone === 'ALL' || b.zone === activeZone);
  const criticalBins = filteredBins.filter(b => b.status === 'CRITICAL' || b.current_fill_percent >= 90).length;
  const warningBins = filteredBins.filter(b => b.status === 'WARNING' || (b.current_fill_percent >= 75 && b.current_fill_percent < 90)).length;
  const normalBins = filteredBins.filter(b => b.status === 'NORMAL').length;
  const totalBins = filteredBins.length || 1;

  // Calculate percentages for Donut Chart
  const criticalPct = Math.round((criticalBins / totalBins) * 100);
  const warningPct = Math.round((warningBins / totalBins) * 100);
  const normalPct = 100 - criticalPct - warningPct;

  // Donut SVG circumference math (r = 40, C = 2 * PI * 40 = 251.32)
  const C = 251.32;
  const criticalDash = (criticalPct / 100) * C;
  const warningDash = (warningPct / 100) * C;
  const normalDash = (normalPct / 100) * C;

  // Daily waste collection data (Tons) - Mon to Sun
  const weeklyCollection = [
    { day: 'Mon', tons: 14.2, baseline: 18.0 },
    { day: 'Tue', tons: 16.8, baseline: 21.5 },
    { day: 'Wed', tons: 15.4, baseline: 19.8 },
    { day: 'Thu', tons: 18.1, baseline: 23.0 },
    { day: 'Fri', tons: 21.4, baseline: 27.2 },
    { day: 'Sat', tons: 24.6, baseline: 31.0 },
    { day: 'Sun', tons: 19.5, baseline: 25.4 }
  ];

  // Completion trend % over 7-day rolling window
  const completionTrend = [
    { day: 'Mon', rate: 91 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 89 },
    { day: 'Thu', rate: 96 },
    { day: 'Fri', rate: 93 },
    { day: 'Sat', rate: 98 },
    { day: 'Sun', rate: 97 }
  ];

  // Zone rankings
  const zoneRankings = [
    { name: 'Central Commercial (A)', score: 88, critical: 4 },
    { name: 'East Market (B)', score: 76, critical: 3 },
    { name: 'South Suburbs (D)', score: 64, critical: 2 },
    { name: 'West Residential (C)', score: 42, critical: 1 }
  ];

  // Vehicle utilization
  const totalFleetCapacity = vehicles.reduce((acc, v) => acc + (v.capacity_kg || 0), 0) || 26800;
  const currentFleetLoad = vehicles.reduce((acc, v) => acc + (v.current_load_kg || 0), 0) || 18460;
  const fleetUtilizationPct = Math.round((currentFleetLoad / totalFleetCapacity) * 100);

  return (
    <div>
      <div className="analytics-grid-row">
        {/* CHART 1: COLLECTION COMPLETION TREND (LINE/AREA CHART) */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>Collection Completion Rate</span>
            <span>7-Day Rolling Window</span>
          </div>

          <div className="chart-viewport-box">
            <svg viewBox="0 0 320 130" className="svg-chart-container">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="30" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="30" y1="60" x2="310" y2="60" stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="30" y1="100" x2="310" y2="100" stroke="#f1f5f9" strokeDasharray="3,3" />

              {/* Area */}
              <path
                d="M 35 45 Q 80 35 125 55 T 215 25 T 305 28 L 305 100 L 35 100 Z"
                fill="url(#trendGrad)"
              />

              {/* Line */}
              <path
                d="M 35 45 Q 80 35 125 55 T 215 25 T 305 28"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {completionTrend.map((pt, i) => {
                const x = 35 + i * 45;
                const y = 100 - (pt.rate - 80) * 4;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x={x} y="118" fontSize="9" textAnchor="middle" fill="#94a3b8">
                      {pt.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
            <span>Target: <b>90.0%</b></span>
            <span>Current Avg: <b style={{ color: '#059669' }}>94.6% (+4.6%)</b></span>
          </div>
        </div>

        {/* CHART 2: DAILY WASTE COLLECTED (BAR CHART) */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>Daily Collected Tonnage</span>
            <span>Metric Tons (MT)</span>
          </div>

          <div className="chart-viewport-box">
            <svg viewBox="0 0 320 130" className="svg-chart-container">
              {weeklyCollection.map((d, i) => {
                const x = 30 + i * 42;
                const barHeight = d.tons * 3.5;
                const y = 105 - barHeight;
                return (
                  <g key={i}>
                    {/* Bar background */}
                    <rect x={x} y="15" width="22" height="90" rx="3" fill="#f8fafc" />
                    {/* Active Bar */}
                    <rect
                      x={x}
                      y={y}
                      width="22"
                      height={barHeight}
                      rx="3"
                      fill="#2563eb"
                      opacity="0.9"
                    />
                    {/* Value above bar */}
                    <text x={x + 11} y={y - 4} fontSize="8" textAnchor="middle" fill="#334155" fontWeight="600">
                      {d.tons}
                    </text>
                    {/* Day label */}
                    <text x={x + 11} y="120" fontSize="9" textAnchor="middle" fill="#94a3b8">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
            <span>Weekly Total: <b>130.4 MT</b></span>
            <span>Peak: <b>Sat (24.6 MT)</b></span>
          </div>
        </div>

        {/* CHART 3: BIN STATUS DISTRIBUTION (DONUT CHART) */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>Bin Status Distribution</span>
            <span>{totalBins} Total Bins</span>
          </div>

          <div className="chart-viewport-box" style={{ gap: '1rem', justifyContent: 'space-around' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />

              {/* Critical slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dc2626"
                strokeWidth="12"
                strokeDasharray={`${criticalDash} ${C}`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />

              {/* Warning slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ea580c"
                strokeWidth="12"
                strokeDasharray={`${warningDash} ${C}`}
                strokeDashoffset={-criticalDash}
                transform="rotate(-90 50 50)"
              />

              {/* Normal slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={`${normalDash} ${C}`}
                strokeDashoffset={-(criticalDash + warningDash)}
                transform="rotate(-90 50 50)"
              />

              {/* Center count */}
              <text x="50" y="47" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
                {totalBins}
              </text>
              <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#64748b">
                BINS
              </text>
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}></span>
                <span>Critical (&gt;90%): <b>{criticalBins} ({criticalPct}%)</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }}></span>
                <span>Warning (&gt;75%): <b>{warningBins} ({warningPct}%)</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                <span>Normal (&lt;75%): <b>{normalBins} ({normalPct}%)</b></span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600, marginTop: '0.2rem' }}>
            ● {criticalBins} bins require urgent dispatch within 2h
          </div>
        </div>

        {/* CHART 4: TOP PRIORITY ZONES RANKING */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>Top Priority Zones</span>
            <span>Urgency Index (0-100)</span>
          </div>

          <div className="chart-viewport-box" style={{ flexDirection: 'column', justifyContent: 'center', gap: '0.45rem' }}>
            {zoneRankings.map((zone, idx) => (
              <div key={idx} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px' }}>
                  <span style={{ color: '#0f172a', fontWeight: 500 }}>{zone.name}</span>
                  <span style={{ fontWeight: 600, color: zone.score > 70 ? '#dc2626' : '#2563eb' }}>
                    {zone.score}/100
                  </span>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${zone.score}%`,
                      backgroundColor: zone.score > 80 ? '#dc2626' : zone.score > 60 ? '#ea580c' : '#2563eb'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
            <span>Fleet Utilization: <b>{fleetUtilizationPct}%</b></span>
            <span>Active Payload: <b>{(currentFleetLoad / 1000).toFixed(1)} T</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
