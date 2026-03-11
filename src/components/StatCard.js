// src/components/StatCard.js
import React from 'react';
import './StatCard.css';

// color: 'teal' | 'amber' | 'rose' | 'green' | 'purple' | 'sky'
export default function StatCard({ icon, label, value, sub, color = 'teal' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}
