// src/pages/patient/PrescriptionsPage.js
import React, { useState, useEffect } from 'react';
import { getMyPrescriptions } from '../../api/prescriptions';

const fmtDate = d => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

export default function PrescriptionsPage() {
  const [rxs, setRxs]      = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState('');
  const [expanded, setExp] = useState(null);

  useEffect(()=>{
    getMyPrescriptions().then(d=>setRxs(d.prescriptions||[])).catch(e=>setError(e.message)).finally(()=>setLoad(false));
  },[]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Prescriptions</h1><p className="page-subtitle">Your medical prescriptions from doctors</p></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner"/></div>}

      {!loading && !error && (<>
        {rxs.length===0
          ? <div className="empty-state"><div className="empty-icon">💊</div><div className="empty-title">No prescriptions yet</div><div className="empty-desc">Your prescriptions will appear here after a doctor visit.</div></div>
          : <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {rxs.map(rx=>(
                <div key={rx.id} className="card">
                  <div style={{display:'flex',alignItems:'center',gap:14,padding:'16px 22px',cursor:'pointer'}} onClick={()=>setExp(expanded===rx.id?null:rx.id)}>
                    <div style={{fontSize:28,flexShrink:0}}>💊</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}>{rx.diagnosis}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>
                        Dr. {rx.doctor?.firstName} {rx.doctor?.lastName} · {fmtDate(rx.prescriptionDate)}
                        {rx.validUntil && ` · Valid until ${fmtDate(rx.validUntil)}`}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
                      <span className={`badge badge-${rx.status||'active'}`}>{rx.status||'active'}</span>
                      <span style={{color:'var(--text-faint)',fontSize:18}}>{expanded===rx.id?'▲':'▼'}</span>
                    </div>
                  </div>
                  {expanded===rx.id && (
                    <div style={{padding:'16px 22px',borderTop:'1px solid var(--border)',background:'var(--surface)',borderRadius:'0 0 var(--r-lg) var(--r-lg)'}}>
                      {rx.medications && (
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--text-muted)',marginBottom:8}}>Medications</div>
                          {Array.isArray(rx.medications)
                            ? rx.medications.map((m,i)=>(
                              <div key={i} style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'10px 14px',marginBottom:6}}>
                                <strong>{m.name}</strong> · {m.dosage} · {m.frequency}
                                {m.duration && <span style={{color:'var(--text-muted)'}}> · {m.duration}</span>}
                              </div>
                            ))
                            : <div style={{fontSize:13,color:'var(--text-muted)'}}>{JSON.stringify(rx.medications)}</div>
                          }
                        </div>
                      )}
                      {rx.instructions && (
                        <div>
                          <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--text-muted)',marginBottom:6}}>Instructions</div>
                          <p style={{fontSize:13.5,color:'var(--text-body)',lineHeight:1.6}}>{rx.instructions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
        }
      </>)}
    </div>
  );
}
