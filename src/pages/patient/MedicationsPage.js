// src/pages/patient/MedicationsPage.js
// Medication schedule + reminders (local state, backend endpoint is a stub)
import React, { useState } from 'react';

const DEMO_MEDS = [
  { id:1, name:'Metformin 500mg',    freq:'Twice daily',   times:['08:00','20:00'], food:'With meal',    remaining:14, total:30 },
  { id:2, name:'Lisinopril 10mg',    freq:'Once daily',    times:['09:00'],          food:'Any time',     remaining:25, total:30 },
  { id:3, name:'Atorvastatin 20mg',  freq:'Once at night', times:['22:00'],          food:'After dinner', remaining:8,  total:30 },
];
const FREQ_OPTS = ['Once daily','Twice daily','Three times daily','Four times daily','As needed'];
const FOOD_OPTS = ['Before meal','With meal','After meal','Any time'];

export default function MedicationsPage() {
  const [meds, setMeds]     = useState(DEMO_MEDS);
  const [showAdd, setShow]  = useState(false);
  const [form, setForm]     = useState({ name:'', freq:'Once daily', times:['08:00'], food:'Any time', total:30 });

  function addMed(e) {
    e.preventDefault();
    setMeds(m=>[...m, { id:Date.now(), ...form, remaining: form.total }]);
    setForm({ name:'',freq:'Once daily',times:['08:00'],food:'Any time',total:30 });
    setShow(false);
  }

  function removeMed(id) { if(window.confirm('Remove this medication?')) setMeds(m=>m.filter(x=>x.id!==id)); }
  function markTaken(id) { setMeds(m=>m.map(x=>x.id===id?{...x,remaining:Math.max(0,x.remaining-1)}:x)); }

  const progress = (m) => Math.round((m.remaining/m.total)*100);
  const progressColor = (p) => p>50?'var(--green)':p>20?'var(--amber)':'var(--rose)';

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Medications & Reminders</h1><p className="page-subtitle">Track your medication schedule and stay on time</p></div>
        <button className="btn btn-primary" onClick={()=>setShow(!showAdd)}>+ Add Medication</button>
      </div>

      {showAdd && (
        <div className="card card-pad" style={{marginBottom:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14,fontFamily:'var(--font-display)'}}>Add New Medication</h3>
          <form onSubmit={addMed}>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Medication Name & Dosage</label><input className="form-input" placeholder="e.g. Metformin 500mg" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Frequency</label>
                <select className="form-select" value={form.freq} onChange={e=>setForm(f=>({...f,freq:e.target.value}))}>
                  {FREQ_OPTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">First Reminder Time</label><input type="time" className="form-input" value={form.times[0]} onChange={e=>setForm(f=>({...f,times:[e.target.value]}))}/></div>
              <div className="form-group"><label className="form-label">Take With Food?</label>
                <select className="form-select" value={form.food} onChange={e=>setForm(f=>({...f,food:e.target.value}))}>
                  {FOOD_OPTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{maxWidth:200,marginBottom:16}}>
              <div className="form-group"><label className="form-label">Total Pills</label><input type="number" className="form-input" min={1} value={form.total} onChange={e=>setForm(f=>({...f,total:+e.target.value}))}/></div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button type="submit" className="btn btn-primary btn-sm">Add Medication</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Today's schedule */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><span className="card-title">⏰ Today's Schedule</span></div>
        <div className="card-body" style={{padding:0}}>
          {meds.flatMap(m=>m.times.map(t=>({...m,time:t}))).sort((a,b)=>a.time.localeCompare(b.time)).map((m,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 22px',borderBottom:'1px solid var(--border)'}}>
              <div style={{background:'var(--navy)',color:'#fff',borderRadius:'var(--r-sm)',padding:'6px 10px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,flexShrink:0}}>{m.time}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{m.name}</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{m.food}</div>
              </div>
              <button className="btn btn-success btn-sm" onClick={()=>markTaken(m.id)}>✓ Taken</button>
            </div>
          ))}
        </div>
      </div>

      {/* All medications */}
      <div className="grid-2">
        {meds.map(med=>{
          const pct = progress(med);
          return (
            <div key={med.id} className="card card-pad">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}>{med.name}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>💊 {med.freq} · {med.food}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>⏰ {med.times.join(', ')}</div>
                </div>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>removeMed(med.id)} title="Remove">🗑</button>
              </div>
              {/* Supply indicator */}
              <div style={{marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5}}>
                  <span style={{color:'var(--text-muted)'}}>Supply remaining</span>
                  <span style={{fontWeight:600,color:progressColor(pct)}}>{med.remaining} / {med.total} pills</span>
                </div>
                <div style={{height:6,background:'var(--border)',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:progressColor(pct),borderRadius:3,transition:'width .3s'}}/>
                </div>
                {med.remaining<=7 && <div style={{fontSize:12,color:'var(--rose)',marginTop:5,fontWeight:600}}>⚠️ Low supply — refill soon!</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
