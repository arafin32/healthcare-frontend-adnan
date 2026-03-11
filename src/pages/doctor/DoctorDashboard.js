// src/pages/doctor/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoctorDashboard } from '../../api/doctors';
import StatCard from '../../components/StatCard';

const fmtDate = d => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});

export default function DoctorDashboard() {
  const { user }          = useAuth();
  const [data, setData]   = useState(null);
  const [loading, setL]   = useState(true);
  const name = user?.profile?.firstName || 'Doctor';

  useEffect(()=>{ getDoctorDashboard().then(setData).catch(console.error).finally(()=>setL(false)); },[]);

  if(loading) return <div className="page-content"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  const todayApts    = data?.todayAppointments    || [];
  const upcomingApts = data?.upcomingAppointments || [];
  const recentPats   = data?.recentPatients       || [];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Dr. {name}! 👋</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
        </div>
        <Link to="/doctor/appointments" className="btn btn-primary">View All Appointments</Link>
      </div>

      <div className="grid-4 mb-4">
        <StatCard icon="📅" label="Today's Appointments" value={todayApts.length}  color="teal"  />
        <StatCard icon="⏳" label="Upcoming Appointments" value={upcomingApts.length} color="sky"   />
        <StatCard icon="👥" label="Recent Patients"       value={recentPats.length}   color="green" />
        <StatCard icon="💊" label="Prescriptions Written" value="—"                  color="amber" sub="Track via Prescriptions"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {/* Today's appointments */}
        <div className="card">
          <div className="card-header"><span className="card-title">Today's Appointments</span><Link to="/doctor/appointments" className="btn btn-ghost btn-sm">View All</Link></div>
          <div style={{padding:0}}>
            {todayApts.length===0
              ? <div className="empty-state" style={{padding:'40px 20px'}}><div className="empty-icon">📅</div><div className="empty-title">No appointments today</div></div>
              : todayApts.map(apt=>(
                <div key={apt.id} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:'1px solid var(--border)'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:apt.status==='confirmed'?'var(--teal)':'var(--amber)',flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13.5}}>{apt.patient?.firstName} {apt.patient?.lastName}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{apt.appointmentTime} · {apt.reason}</div>
                  </div>
                  <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="card-header"><span className="card-title">Upcoming Appointments</span></div>
          <div style={{padding:0}}>
            {upcomingApts.length===0
              ? <div className="empty-state" style={{padding:'40px 20px'}}><div className="empty-icon">⏳</div><div className="empty-title">No upcoming appointments</div></div>
              : upcomingApts.map(apt=>(
                <div key={apt.id} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:'1px solid var(--border)'}}>
                  <div style={{background:'var(--sky-light)',color:'var(--sky)',borderRadius:'var(--r-sm)',padding:'5px 8px',fontSize:11,fontWeight:700,textAlign:'center',flexShrink:0,minWidth:44}}>
                    {fmtDate(apt.appointmentDate)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13.5}}>{apt.patient?.firstName} {apt.patient?.lastName}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{apt.appointmentTime}</div>
                  </div>
                  <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
