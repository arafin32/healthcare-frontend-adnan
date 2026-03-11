// src/pages/patient/HealthMetricsPage.js
// Health metrics tracking with charts (local state — backend stub)
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for demonstration (backend endpoint is a stub)
const SAMPLE_DATA = [
  { date:'Jan 10', bmi:24.2, bp_sys:120, bp_dia:80,  heartRate:72 },
  { date:'Jan 20', bmi:24.0, bp_sys:118, bp_dia:78,  heartRate:74 },
  { date:'Feb 1',  bmi:23.8, bp_sys:122, bp_dia:82,  heartRate:70 },
  { date:'Feb 15', bmi:23.5, bp_sys:119, bp_dia:79,  heartRate:73 },
  { date:'Mar 1',  bmi:23.4, bp_sys:117, bp_dia:77,  heartRate:71 },
  { date:'Mar 15', bmi:23.2, bp_sys:121, bp_dia:81,  heartRate:75 },
];

const METRIC_INFO = {
  bmi:       { label:'BMI',           unit:'',     color:'#0D9488', normal:'18.5–24.9' },
  bp_sys:    { label:'Systolic BP',   unit:'mmHg', color:'#F43F5E', normal:'<120 mmHg' },
  bp_dia:    { label:'Diastolic BP',  unit:'mmHg', color:'#8B5CF6', normal:'<80 mmHg'  },
  heartRate: { label:'Heart Rate',    unit:'bpm',  color:'#F59E0B', normal:'60–100 bpm' },
};

export default function HealthMetricsPage() {
  const [data, setData]       = useState(SAMPLE_DATA);
  const [form, setForm]       = useState({ date:'', bmi:'', bp_sys:'', bp_dia:'', heartRate:'' });
  const [showForm, setShow]   = useState(false);
  const [activeMetric, setAM] = useState('bmi');

  function logMetric(e) {
    e.preventDefault();
    const entry = { date: form.date, bmi: +form.bmi||null, bp_sys: +form.bp_sys||null, bp_dia: +form.bp_dia||null, heartRate: +form.heartRate||null };
    setData(prev => [...prev, entry].sort((a,b)=>new Date(a.date)-new Date(b.date)));
    setForm({ date:'',bmi:'',bp_sys:'',bp_dia:'',heartRate:'' });
    setShow(false);
  }

  const latest = data[data.length-1];
  const m = METRIC_INFO[activeMetric];

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Health Metrics</h1><p className="page-subtitle">Track BMI, blood pressure, heart rate and trends over time</p></div>
        <button className="btn btn-primary" onClick={()=>setShow(!showForm)}>+ Log Metrics</button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="card card-pad" style={{marginBottom:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14,fontFamily:'var(--font-display)'}}>Log New Metrics</h3>
          <form onSubmit={logMetric}>
            <div className="grid-4" style={{gap:12}}>
              <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required/></div>
              <div className="form-group"><label className="form-label">BMI</label><input type="number" step="0.1" className="form-input" placeholder="23.5" value={form.bmi} onChange={e=>setForm(f=>({...f,bmi:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Systolic BP</label><input type="number" className="form-input" placeholder="120" value={form.bp_sys} onChange={e=>setForm(f=>({...f,bp_sys:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Diastolic BP</label><input type="number" className="form-input" placeholder="80" value={form.bp_dia} onChange={e=>setForm(f=>({...f,bp_dia:e.target.value}))}/></div>
            </div>
            <div className="grid-2" style={{gap:12,maxWidth:300}}>
              <div className="form-group"><label className="form-label">Heart Rate (bpm)</label><input type="number" className="form-input" placeholder="72" value={form.heartRate} onChange={e=>setForm(f=>({...f,heartRate:e.target.value}))}/></div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button type="submit" className="btn btn-primary btn-sm">Save Entry</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Latest readings */}
      <div className="grid-4 mb-4">
        {Object.entries(METRIC_INFO).map(([k,info])=>(
          <div key={k} className="card card-pad" style={{cursor:'pointer',border:activeMetric===k?`2px solid ${info.color}`:'1px solid var(--border)'}} onClick={()=>setAM(k)}>
            <div style={{fontSize:11.5,fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',letterSpacing:'.05em',marginBottom:6}}>{info.label}</div>
            <div style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)',color:info.color}}>{latest?.[k]||'—'}{info.unit&&<span style={{fontSize:14,fontWeight:500,marginLeft:3}}>{info.unit}</span>}</div>
            <div style={{fontSize:11.5,color:'var(--text-faint)',marginTop:4}}>Normal: {info.normal}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card card-pad">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <h3 style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-display)'}}>{m.label} Trend</h3>
          <div style={{display:'flex',gap:6}}>
            {Object.entries(METRIC_INFO).map(([k,info])=>(
              <button key={k} className={`btn btn-sm ${activeMetric===k?'btn-primary':'btn-ghost'}`} onClick={()=>setAM(k)} style={activeMetric===k?{background:info.color}:{}}>
                {info.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{top:5,right:20,bottom:5,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{fontSize:12,fill:'var(--text-muted)'}} />
            <YAxis tick={{fontSize:12,fill:'var(--text-muted)'}} />
            <Tooltip contentStyle={{borderRadius:'var(--r)',border:'1px solid var(--border)',fontSize:13}} />
            <Line type="monotone" dataKey={activeMetric} stroke={m.color} strokeWidth={2.5} dot={{r:4,fill:m.color}} activeDot={{r:6}} name={m.label} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alert for abnormal values */}
      {latest && (latest.bmi > 30 || latest.bmi < 18.5) && (
        <div className="alert alert-warning" style={{marginTop:16}}>
          <span className="alert-icon">⚠️</span>
          <div><strong>BMI Alert:</strong> Your BMI of {latest.bmi} is outside the normal range (18.5–24.9). Consider consulting your doctor.</div>
        </div>
      )}
      {latest && latest.bp_sys > 130 && (
        <div className="alert alert-warning" style={{marginTop:8}}>
          <span className="alert-icon">⚠️</span>
          <div><strong>Blood Pressure Alert:</strong> Your systolic BP of {latest.bp_sys} mmHg is elevated. Monitor closely.</div>
        </div>
      )}
    </div>
  );
}
