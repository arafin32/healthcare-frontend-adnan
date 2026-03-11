// src/pages/patient/LabResultsPage.js
// Lab results — API endpoint is a stub, so we show a clean UI with demo data
import React, { useState } from 'react';

const DEMO_RESULTS = [
  { id:1, testName:'Complete Blood Count (CBC)', date:'2026-02-10', status:'normal', doctor:'Dr. Smith', results:[{test:'Hemoglobin',value:'14.2 g/dL',ref:'12–17 g/dL',status:'normal'},{test:'WBC',value:'6.8 K/uL',ref:'4.5–11 K/uL',status:'normal'},{test:'Platelets',value:'220 K/uL',ref:'150–400 K/uL',status:'normal'}] },
  { id:2, testName:'Lipid Panel', date:'2026-01-20', status:'review', doctor:'Dr. Johnson', results:[{test:'Total Cholesterol',value:'215 mg/dL',ref:'<200 mg/dL',status:'high'},{test:'LDL',value:'138 mg/dL',ref:'<130 mg/dL',status:'high'},{test:'HDL',value:'52 mg/dL',ref:'>40 mg/dL',status:'normal'},{test:'Triglycerides',value:'148 mg/dL',ref:'<150 mg/dL',status:'normal'}] },
  { id:3, testName:'Blood Glucose (Fasting)', date:'2026-01-15', status:'normal', doctor:'Dr. Patel', results:[{test:'Glucose',value:'92 mg/dL',ref:'70–99 mg/dL',status:'normal'}] },
];

const STATUS_COLORS = { normal:'var(--green)', high:'var(--rose)', low:'var(--amber)' };

export default function LabResultsPage() {
  const [expanded, setExp] = useState(null);

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Lab Results</h1><p className="page-subtitle">View your test results and health reports securely</p></div>
      </div>

      <div className="alert alert-info"><span className="alert-icon">ℹ️</span>Lab results are uploaded by your doctor or lab staff. Contact your healthcare provider to request new tests.</div>

      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {DEMO_RESULTS.map(r=>(
          <div key={r.id} className="card">
            <div style={{display:'flex',alignItems:'center',gap:14,padding:'16px 22px',cursor:'pointer'}} onClick={()=>setExp(expanded===r.id?null:r.id)}>
              <div style={{fontSize:28}}>🧪</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}>{r.testName}</div>
                <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>📅 {new Date(r.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · {r.doctor}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
                <span className={`badge badge-${r.status==='normal'?'completed':'pending'}`}>{r.status==='normal'?'Normal':'Needs Review'}</span>
                <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();alert('Download feature coming soon!');}}>⬇ Download</button>
                <span style={{color:'var(--text-faint)',fontSize:18}}>{expanded===r.id?'▲':'▼'}</span>
              </div>
            </div>

            {expanded===r.id && (
              <div style={{padding:'0 22px 20px'}}>
                <div className="table-wrap" style={{border:'1px solid var(--border)',borderRadius:'var(--r)'}}>
                  <table>
                    <thead><tr><th>Test</th><th>Result</th><th>Reference Range</th><th>Status</th></tr></thead>
                    <tbody>
                      {r.results.map((row,i)=>(
                        <tr key={i}>
                          <td style={{fontWeight:600}}>{row.test}</td>
                          <td style={{fontWeight:700,color:STATUS_COLORS[row.status]||'inherit'}}>{row.value}</td>
                          <td style={{color:'var(--text-muted)'}}>{row.ref}</td>
                          <td><span className={`badge badge-${row.status==='normal'?'completed':row.status==='high'?'cancelled':'pending'}`}>{row.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
