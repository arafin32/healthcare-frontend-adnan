// src/pages/doctor/DoctorProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorProfile, updateDoctorProfile } from '../../api/doctors';

export default function DoctorProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ firstName:'',lastName:'',phoneNumber:'',specialization:'',department:'',qualification:'',licenseNumber:'' });
  const [loading, setL] = useState(true);
  const [saving, setSv] = useState(false);
  const [err, setErr]   = useState('');
  const [succ, setSucc] = useState('');

  useEffect(()=>{
    getDoctorProfile().then(p=>setForm({ firstName:p.firstName||'',lastName:p.lastName||'',phoneNumber:p.phoneNumber||'',specialization:p.specialization||'',department:p.department||'',qualification:p.qualification||'',licenseNumber:p.licenseNumber||'' }))
    .catch(e=>setErr(e.message)).finally(()=>setL(false));
  },[]);

  async function save(e) {
    e.preventDefault(); setErr(''); setSucc(''); setSv(true);
    try { const u=await updateDoctorProfile(form); refreshUser(u); setSucc('Profile updated!'); setTimeout(()=>setSucc(''),4000); }
    catch(err){ setErr(err.message); }
    finally{ setSv(false); }
  }

  if(loading) return <div className="page-content"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  return (
    <div className="page-content" style={{maxWidth:700}}>
      <div className="page-header"><div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Update your professional information</p></div></div>
      <div className="card card-pad" style={{marginBottom:20,display:'flex',alignItems:'center',gap:18}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--teal)',color:'#fff',fontFamily:'var(--font-display)',fontSize:26,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          {form.firstName?.[0]}{form.lastName?.[0]}
        </div>
        <div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--font-display)'}}>Dr. {form.firstName} {form.lastName}</div>
          <div style={{fontSize:13,color:'var(--teal)',marginTop:2}}>{form.specialization}</div>
          <div style={{fontSize:13,color:'var(--text-muted)'}}>{user?.email}</div>
          <span className="badge badge-doctor" style={{marginTop:6}}>Doctor</span>
        </div>
      </div>
      <div className="card card-pad">
        {err  && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{err}</div>}
        {succ && <div className="alert alert-success"><span className="alert-icon">✅</span>{succ}</div>}
        <form onSubmit={save}>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} required/></div>
            <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} required/></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={form.phoneNumber} onChange={e=>setForm(f=>({...f,phoneNumber:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">License Number</label><input className="form-input" value={form.licenseNumber} onChange={e=>setForm(f=>({...f,licenseNumber:e.target.value}))}/></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Specialization</label><input className="form-input" value={form.specialization} onChange={e=>setForm(f=>({...f,specialization:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))}/></div>
          </div>
          <div className="form-group"><label className="form-label">Qualifications</label><input className="form-input" value={form.qualification} onChange={e=>setForm(f=>({...f,qualification:e.target.value}))} placeholder="MBBS, MD, FCPS…"/></div>
          <div style={{display:'flex',justifyContent:'flex-end'}}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
