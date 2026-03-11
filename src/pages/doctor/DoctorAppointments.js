// src/pages/doctor/DoctorAppointments.js
import React, { useState, useEffect, useCallback } from 'react';
import { getMyAppointments, updateAppointment } from '../../api/appointments';

const TABS = ['all','pending','confirmed','completed','cancelled'];
const fmtDate = d => new Date(d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});

export default function DoctorAppointments() {
  const [tab,  setTab]   = useState('all');
  const [apts, setApts]  = useState([]);
  const [load, setLoad]  = useState(true);
  const [err,  setErr]   = useState('');
  const [busy, setBusy]  = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [notes, setNotes] = useState('');

  const fetch = useCallback(async()=>{
    setLoad(true); setErr('');
    try { const d=await getMyAppointments(tab!=='all'?{status:tab}:{}); setApts(d.appointments||[]); }
    catch(e){ setErr(e.message); }
    finally{ setLoad(false); }
  },[tab]);

  useEffect(()=>{ fetch(); },[fetch]);

  async function changeStatus(id, status) {
    setBusy(id);
    try { await updateAppointment(id, { status }); fetch(); }
    catch(e){ alert(e.message); }
    finally{ setBusy(null); }
  }

  async function saveNotes(id) {
    setBusy(id);
    try { await updateAppointment(id, { notes, status:'completed' }); setNoteModal(null); fetch(); }
    catch(e){ alert(e.message); }
    finally{ setBusy(null); }
  }

  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Appointments</h1><p className="page-subtitle">Manage your patient appointments</p></div></div>
      <div className="tabs">{TABS.map(t=><button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div>
      {err  && <div className="alert alert-error">{err}</div>}
      {load && <div className="spinner-wrap"><div className="spinner"/></div>}
      {!load && !err && (<>
        {apts.length===0
          ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No {tab!=='all'?tab:''} appointments</div></div>
          : <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {apts.map(apt=>(
                <div key={apt.id} className="card" style={{display:'flex',alignItems:'center',gap:16,padding:'16px 22px',flexWrap:'wrap'}}>
                  <div style={{background:'var(--navy)',color:'#fff',borderRadius:'var(--r)',padding:'8px 12px',textAlign:'center',flexShrink:0,minWidth:52}}>
                    <div style={{fontSize:20,fontWeight:800,fontFamily:'var(--font-display)',lineHeight:1}}>{new Date(apt.appointmentDate).getDate()}</div>
                    <div style={{fontSize:10,textTransform:'uppercase',fontWeight:700,opacity:.8}}>{new Date(apt.appointmentDate).toLocaleDateString('en-US',{month:'short'})}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}>{apt.patient?.firstName} {apt.patient?.lastName}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>🕐 {apt.appointmentTime} · 📝 {apt.reason}</div>
                    <div style={{fontSize:12,color:'var(--text-faint)'}}>{fmtDate(apt.appointmentDate)}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                    <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                    {apt.status==='pending'   && <button className="btn btn-success btn-sm" onClick={()=>changeStatus(apt.id,'confirmed')} disabled={busy===apt.id}>{busy===apt.id?'…':'Confirm'}</button>}
                    {apt.status==='confirmed' && <button className="btn btn-primary btn-sm" onClick={()=>{setNoteModal(apt.id);setNotes('');}} disabled={busy===apt.id}>Complete</button>}
                    {apt.status==='pending'   && <button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(apt.id,'cancelled')} disabled={busy===apt.id}>Decline</button>}
                  </div>
                </div>
              ))}
            </div>
        }
      </>)}

      {/* Complete with notes modal */}
      {noteModal && (
        <div className="modal-overlay" onClick={()=>setNoteModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Complete Appointment</span><button className="modal-close" onClick={()=>setNoteModal(null)}>×</button></div>
            <div className="modal-body">
              <p style={{fontSize:13.5,color:'var(--text-muted)',marginBottom:16}}>Add notes or diagnosis before marking as completed.</p>
              <div className="form-group"><label className="form-label">Diagnosis / Notes</label><textarea className="form-textarea" rows={4} placeholder="Enter diagnosis, treatment notes…" value={notes} onChange={e=>setNotes(e.target.value)}/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setNoteModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>saveNotes(noteModal)} disabled={busy===noteModal}>{busy===noteModal?'Saving…':'Mark Complete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
