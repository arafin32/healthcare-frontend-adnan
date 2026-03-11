// src/pages/doctor/DoctorPatients.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAllPatients, getPatientById } from '../../api/patients';
import { getPatientPrescriptions } from '../../api/prescriptions';

export default function DoctorPatients() {
  const [patients, setPats] = useState([]);
  const [loading, setL]     = useState(true);
  const [error, setErr]     = useState('');
  const [search, setSrch]   = useState('');
  const [selected, setSel]  = useState(null);
  const [detail, setDetail] = useState(null);
  const [detLoad, setDL]    = useState(false);
  const [rxs, setRxs]       = useState([]);

  const load = useCallback(async()=>{
    setL(true); setErr('');
    try { const d=await getAllPatients({search}); setPats(d.patients||[]); }
    catch(e){ setErr(e.message); }
    finally{ setL(false); }
  },[search]);

  useEffect(()=>{ load(); },[load]);

  async function openPatient(id) {
    setSel(id); setDL(true);
    try {
      const [pat, prescriptions] = await Promise.all([getPatientById(id), getPatientPrescriptions(id).catch(()=>[])]);
      setDetail(pat); setRxs(Array.isArray(prescriptions)?prescriptions:[]);
    } catch(e){ alert(e.message); }
    finally{ setDL(false); }
  }

  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">My Patients</h1><p className="page-subtitle">Search and access patient records</p></div></div>
      <div className="search-row" style={{display:'flex',gap:10,marginBottom:20}}>
        <input type="text" className="form-input" style={{flex:1}} placeholder="🔍  Search patients by name or phone…" value={search} onChange={e=>setSrch(e.target.value)} />
        <button className="btn btn-primary" onClick={load}>Search</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner"/></div>}
      {!loading && !error && (<>
        {patients.length===0
          ? <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No patients found</div></div>
          : <div className="table-wrap card">
              <table>
                <thead><tr><th>Patient</th><th>Email</th><th>Phone</th><th>Gender</th><th>Blood Group</th><th>Action</th></tr></thead>
                <tbody>
                  {patients.map(p=>(
                    <tr key={p.id}>
                      <td><div style={{fontWeight:700}}>{p.firstName} {p.lastName}</div></td>
                      <td style={{color:'var(--text-muted)'}}>{p.user?.email}</td>
                      <td>{p.phoneNumber}</td>
                      <td style={{textTransform:'capitalize'}}>{p.gender}</td>
                      <td>{p.bloodGroup||'—'}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={()=>openPatient(p.id)}>View Record</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </>)}

      {/* Patient detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>{setSel(null);setDetail(null);setRxs([]);}}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{detLoad?'Loading…':`${detail?.firstName} ${detail?.lastName}`}</div>
              <button className="modal-close" onClick={()=>{setSel(null);setDetail(null);setRxs([]);}}>×</button>
            </div>
            {detLoad
              ? <div className="modal-body"><div className="spinner-wrap"><div className="spinner"/></div></div>
              : detail && <div className="modal-body">
                  {/* Patient info */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
                    {[['Email',detail.user?.email],['Phone',detail.phoneNumber],['Gender',detail.gender],['Blood Group',detail.bloodGroup||'N/A'],['Date of Birth',detail.dateOfBirth?new Date(detail.dateOfBirth).toLocaleDateString():'N/A'],['Address',detail.address||'N/A']].map(([l,v])=>(
                      <div key={l} style={{background:'var(--surface)',padding:'10px 12px',borderRadius:'var(--r)'}}>
                        <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:2}}>{l}</div>
                        <div style={{fontSize:13.5,fontWeight:500}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {/* Prescriptions */}
                  <h4 style={{fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--text-muted)',marginBottom:10}}>Prescriptions</h4>
                  {rxs.length===0
                    ? <div style={{fontSize:13.5,color:'var(--text-faint)',padding:'10px 0'}}>No prescriptions on record.</div>
                    : rxs.map(rx=>(
                      <div key={rx.id} style={{border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'12px',marginBottom:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontWeight:700,fontSize:14}}>{rx.diagnosis}</span>
                          <span className={`badge badge-${rx.status||'active'}`}>{rx.status||'active'}</span>
                        </div>
                        <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{new Date(rx.prescriptionDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                      </div>
                    ))
                  }
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
