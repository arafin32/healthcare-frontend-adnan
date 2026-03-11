// src/pages/doctor/DoctorPrescriptions.js
import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../../api/patients';
import { createPrescription, getPatientPrescriptions } from '../../api/prescriptions';

const DEFAULT_MED = { name:'', dosage:'', frequency:'', duration:'' };

export default function DoctorPrescriptions() {
  const [patients, setPats] = useState([]);
  const [selPat, setSelPat] = useState('');
  const [rxs, setRxs]       = useState([]);
  const [rxLoad, setRxLoad]    = useState(false);
  const [showForm, setShow] = useState(false);
  const [saving, setSave]   = useState(false);
  const [error, setErr]     = useState('');
  const [success, setSucc]  = useState('');
  const [meds, setMeds]     = useState([{ ...DEFAULT_MED }]);
  const [form, setForm]     = useState({ diagnosis:'', instructions:'', validUntil:'' });

  useEffect(()=>{ getAllPatients({limit:50}).then(d=>setPats(d.patients||[])).catch(console.error); },[]);

  async function loadRxs(pid) {
    setSelPat(pid); setRxLoad(true);
    try { const data=await getPatientPrescriptions(pid); setRxs(Array.isArray(data)?data:[]); }
    catch{ setRxs([]); }
    finally{ setRxLoad(false); }
  }

  function addMed() { setMeds(m=>[...m,{...DEFAULT_MED}]); }
  function updateMed(i,k,v) { setMeds(m=>m.map((x,idx)=>idx===i?{...x,[k]:v}:x)); }
  function removeMed(i) { setMeds(m=>m.filter((_,idx)=>idx!==i)); }

  async function handleCreate(e) {
    e.preventDefault();
    if(!selPat) { setErr('Please select a patient first.'); return; }
    setErr(''); setSave(true);
    try {
      await createPrescription({ patientId:selPat, medications:meds, diagnosis:form.diagnosis, instructions:form.instructions, validUntil:form.validUntil||undefined });
      setSucc('Prescription created!'); setShow(false); setMeds([{...DEFAULT_MED}]); setForm({diagnosis:'',instructions:'',validUntil:''});
      await loadRxs(selPat);
      setTimeout(()=>setSucc(''),4000);
    } catch(err){ setErr(err.message); }
    finally{ setSave(false); }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Prescriptions</h1><p className="page-subtitle">Create and manage patient prescriptions</p></div>
        <button className="btn btn-primary" onClick={()=>setShow(!showForm)}>+ New Prescription</button>
      </div>

      {error   && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{error}</div>}
      {success && <div className="alert alert-success"><span className="alert-icon">✅</span>{success}</div>}

      {/* Patient selector */}
      <div className="card card-pad" style={{marginBottom:20}}>
        <label className="form-label">Select Patient to View / Create Prescriptions</label>
        <select className="form-select" style={{maxWidth:400}} value={selPat} onChange={e=>loadRxs(e.target.value)}>
          <option value="">-- Select a patient --</option>
          {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
      </div>

      {/* Create prescription form */}
      {showForm && selPat && (
        <div className="card card-pad" style={{marginBottom:20}}>
          <h3 style={{fontSize:14,fontWeight:700,fontFamily:'var(--font-display)',marginBottom:16}}>New Prescription for {patients.find(p=>p.id===selPat)?.firstName}</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group"><label className="form-label">Diagnosis <span className="req">*</span></label><input className="form-input" value={form.diagnosis} onChange={e=>setForm(f=>({...f,diagnosis:e.target.value}))} placeholder="Primary diagnosis" required/></div>

            <div style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <label className="form-label" style={{margin:0}}>Medications</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addMed}>+ Add Medication</button>
              </div>
              {meds.map((m,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:8,marginBottom:8,alignItems:'center'}}>
                  <input className="form-input" placeholder="Drug name" value={m.name}      onChange={e=>updateMed(i,'name',e.target.value)} required/>
                  <input className="form-input" placeholder="Dosage (e.g. 500mg)" value={m.dosage}   onChange={e=>updateMed(i,'dosage',e.target.value)}/>
                  <input className="form-input" placeholder="Frequency" value={m.frequency} onChange={e=>updateMed(i,'frequency',e.target.value)}/>
                  <input className="form-input" placeholder="Duration" value={m.duration}  onChange={e=>updateMed(i,'duration',e.target.value)}/>
                  {meds.length>1 && <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={()=>removeMed(i)}>🗑</button>}
                </div>
              ))}
            </div>

            <div className="grid-2">
              <div className="form-group"><label className="form-label">Instructions</label><textarea className="form-textarea" rows={2} value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} placeholder="Take with water after meals…"/></div>
              <div className="form-group"><label className="form-label">Valid Until</label><input type="date" className="form-input" value={form.validUntil} onChange={e=>setForm(f=>({...f,validUntil:e.target.value}))}/></div>
            </div>

            <div style={{display:'flex',gap:10,marginTop:4}}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Create Prescription'}</button>
              <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Patient's prescriptions */}
      {selPat && (
        <div className="card">
          <div className="card-header"><span className="card-title">Prescription History</span></div>
          {rxLoad
            ? <div className="spinner-wrap"><div className="spinner"/></div>
            : rxs.length===0
              ? <div className="empty-state"><div className="empty-icon">💊</div><div className="empty-title">No prescriptions yet for this patient</div></div>
              : rxs.map(rx=>(
                <div key={rx.id} style={{padding:'14px 22px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:14}}>
                  <span style={{fontSize:24}}>💊</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{rx.diagnosis}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(rx.prescriptionDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}{rx.validUntil&&` · Valid until ${new Date(rx.validUntil).toLocaleDateString()}`}</div>
                  </div>
                  <span className={`badge badge-${rx.status||'active'}`}>{rx.status||'active'}</span>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
