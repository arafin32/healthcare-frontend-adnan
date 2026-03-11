// src/components/DoctorCard.js
import React from 'react';
import './DoctorCard.css';

const SPEC_COLORS = {
  Cardiology:'#EF4444', Neurology:'#8B5CF6', Pediatrics:'#F59E0B',
  Dermatology:'#EC4899', Orthopedics:'#3B82F6', Oncology:'#10B981',
};

export default function DoctorCard({ doctor, onBook }) {
  const name  = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  const avail = doctor.user?.isActive !== false;
  const color = SPEC_COLORS[doctor.specialization] || 'var(--teal)';
  const initials = `${doctor.firstName?.[0]}${doctor.lastName?.[0]}`;

  return (
    <div className="doctor-card">
      <div className="dc-avatar" style={{ background: color }}>{initials}</div>
      <div className="dc-body">
        <div className="dc-name">{name}</div>
        <span className="dc-spec" style={{ background: `${color}18`, color }}>{doctor.specialization}</span>
        {doctor.department && <p className="dc-detail">🏥 {doctor.department}</p>}
        {doctor.qualification && <p className="dc-detail">🎓 {doctor.qualification}</p>}
        <div className="dc-footer">
          <span className={avail ? 'avail-yes' : 'avail-no'}>
            {avail ? '● Available' : '● Unavailable'}
          </span>
          {avail && (
            <button className="btn btn-primary btn-sm" onClick={() => onBook(doctor)}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
