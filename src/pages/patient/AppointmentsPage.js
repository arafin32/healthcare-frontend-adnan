// src/pages/patient/AppointmentsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyAppointments, cancelAppointment } from '../../api/appointments';

const TABS = ['all','pending','confirmed','completed','cancelled'];
const fmtDate = d => new Date(d).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'});

export default function AppointmentsPage() {
  const { user }           = useAuth();
  const navigate           = useNavigate();
  const [tab,  setTab]     = useState('all');
  const [apts, setApts]    = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState('');
  const [busy, setBusy]    = useState(null);

  useEffect(()=>{ if(!user) navigate('/login'); },[user,navigate]);

  const load = useCallback(async()=>{
    setLoad(true); setError('');
    try {
      const p = tab!=='all' ? { status:tab } : {};
      const d = await getMyAppointments(p);
      setApts(d.appointments||[]);
    } catch(err){ setError(err.message); }
    finally{ setLoad(false); }
  },[tab]);

  useEffect(()=>{ load(); },[load]);

  async function doCancel(id) {
    if(!window.confirm('Cancel this appointment?')) return;
    setBusy(id);
    try { await cancelAppointment(id); load(); } catch(e){ alert(e.message); }
    finally{ setBusy(null); }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">View and manage your booked appointments</p>
        </div>
        <a href="/patient/doctors" className="btn btn-primary">+ New Appointment</a>
      </div>

      <div className="tabs">
        {TABS.map(t=>(
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {error  && <div className="alert alert-error">{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner"/></div>}

      {!loading && !error && (<>
        {apts.length===0
          ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No {tab!=='all'?tab:''} appointments</div><div className="empty-desc">Book an appointment from <a href="/patient/doctors" style={{color:'var(--teal)'}}>Find Doctors</a>.</div></div>
          : <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {apts.map(apt=>(
                <div key={apt.id} className="card" style={{display:'flex',alignItems:'center',gap:16,padding:'18px 22px',flexWrap:'wrap'}}>
                  {/* Date block */}
                  <div style={{background:'var(--teal)',color:'#fff',borderRadius:'var(--r)',padding:'10px 14px',textAlign:'center',flexShrink:0,minWidth:52}}>
                    <div style={{fontSize:24,fontWeight:800,fontFamily:'var(--font-display)',lineHeight:1}}>{new Date(apt.appointmentDate).getDate()}</div>
                    <div style={{fontSize:10,textTransform:'uppercase',fontWeight:700,opacity:.85}}>{new Date(apt.appointmentDate).toLocaleDateString('en-US',{month:'short'})}</div>
                    <div style={{fontSize:11,marginTop:3,opacity:.8}}>{apt.appointmentTime}</div>
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    {apt.doctor && <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}> Dr. {apt.doctor.firstName} {apt.doctor.lastName}</div>}
                    {apt.doctor && <div style={{fontSize:12,color:'var(--teal)',margin:'2px 0'}}>🩺 {apt.doctor.specialization}</div>}
                    <div style={{fontSize:13,color:'var(--text-muted)'}}>📝 {apt.reason}</div>
                    <div style={{fontSize:12,color:'var(--text-faint)',marginTop:3}}>📅 {fmtDate(apt.appointmentDate)}</div>
                  </div>
                  {/* Actions */}
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,flexShrink:0}}>
                    <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                    {['pending','confirmed'].includes(apt.status) && (
                      <button className="btn btn-danger btn-sm" onClick={()=>doCancel(apt.id)} disabled={busy===apt.id}>
                        {busy===apt.id?'…':'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
        }
      </>)}
    </div>
  );
}
