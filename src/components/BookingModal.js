// src/components/BookingModal.js
import React, { useState } from 'react';
import { createAppointment } from '../api/appointments';
import './BookingModal.css';

const SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

export default function BookingModal({ doctor, onClose, onSuccess }) {
  const [date,   setDate]   = useState('');
  const [time,   setTime]   = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!date || !time || !reason.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await createAppointment({ doctorId: doctor.id, appointmentDate: date, appointmentTime: time, reason });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to book. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Book Appointment</div>
            <div className="text-muted text-sm">Dr. {doctor.firstName} {doctor.lastName} · {doctor.specialization}</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Date <span className="req">*</span></label>
              <input type="date" className="form-input" value={date} min={today} onChange={e=>setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot <span className="req">*</span></label>
              <div className="time-grid">
                {SLOTS.map(s => (
                  <button key={s} type="button"
                    className={`time-slot ${time===s?'selected':''}`}
                    onClick={()=>setTime(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Visit <span className="req">*</span></label>
              <textarea className="form-textarea" rows={3} placeholder="Describe your symptoms..." value={reason} onChange={e=>setReason(e.target.value)} required />
            </div>
            <div className="modal-footer" style={{padding:0,border:'none',marginTop:8}}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading || !time}>
                {loading ? 'Booking…' : '✓ Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
