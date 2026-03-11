// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../api/admin';
import StatCard from '../../components/StatCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const STATUS_COLORS = { pending:'#F59E0B', confirmed:'#0EA5E9', completed:'#10B981', cancelled:'#F43F5E' };
const BAR_COLORS    = ['#0D9488','#0EA5E9','#8B5CF6','#F59E0B'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(true);
  const [err, setErr]   = useState('');

  useEffect(()=>{ getAnalytics().then(setData).catch(e=>setErr(e.message)).finally(()=>setLoad(false)); },[]);

  if(load) return <div className="page-content"><div className="spinner-wrap"><div className="spinner"/></div></div>;
  if(err)  return <div className="page-content"><div className="alert alert-error">{err}</div></div>;

  const totals = data?.totals || {};
  const aptStats = (data?.appointmentStats||[]).map(s=>({ name:s.status, value:parseInt(s.count), color: STATUS_COLORS[s.status]||'#ccc' }));
  const regData = [
    { name:'Patients', new: data?.recentRegistrations?.patients||0, total: totals.patients||0 },
    { name:'Doctors',  new: data?.recentRegistrations?.doctors||0,  total: totals.doctors||0  },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Admin Dashboard</h1><p className="page-subtitle">System-wide analytics and operational overview</p></div>
      </div>

      {/* KPI tiles */}
      <div className="grid-4 mb-4">
        <StatCard icon="🧑‍⚕️" label="Total Patients"     value={totals.patients||0}      color="teal"   />
        <StatCard icon="👨‍⚕️" label="Total Doctors"      value={totals.doctors||0}       color="sky"    />
        <StatCard icon="📅" label="Total Appointments" value={totals.appointments||0}   color="green"  />
        <StatCard icon="💊" label="Prescriptions"      value={totals.prescriptions||0}  color="amber"  />
      </div>
      <div className="grid-4 mb-4">
        <StatCard icon="👤" label="Active Users"       value={totals.activeUsers||0}    color="purple" />
        <StatCard icon="🆕" label="New Patients (30d)" value={data?.recentRegistrations?.patients||0} color="teal" sub="Last 30 days"/>
        <StatCard icon="🆕" label="New Doctors (30d)"  value={data?.recentRegistrations?.doctors||0}  color="sky"  sub="Last 30 days"/>
        <StatCard icon="📊" label="System Health"      value="Online"                   color="green"  />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Appointments by status — pie */}
        <div className="card card-pad">
          <h3 className="card-title" style={{marginBottom:16}}>Appointments by Status</h3>
          {aptStats.length===0
            ? <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No data yet</div></div>
            : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={aptStats} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {aptStats.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip formatter={(v,n)=>[v,n]} contentStyle={{borderRadius:'var(--r)',fontSize:13}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',marginTop:10}}>
                {aptStats.map(s=>(
                  <div key={s.name} style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
                    <div style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0}}/>
                    <span style={{textTransform:'capitalize'}}>{s.name}</span>
                    <strong>({s.value})</strong>
                  </div>
                ))}
              </div>
            </>
          }
        </div>

        {/* Registration trends */}
        <div className="card card-pad">
          <h3 className="card-title" style={{marginBottom:16}}>New vs Total Registrations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regData} margin={{top:5,right:20,bottom:5,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{fontSize:12,fill:'var(--text-muted)'}}/>
              <YAxis tick={{fontSize:12,fill:'var(--text-muted)'}}/>
              <Tooltip contentStyle={{borderRadius:'var(--r)',fontSize:13}}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="new"   name="New (30d)"  fill="#0D9488" radius={[4,4,0,0]}/>
              <Bar dataKey="total" name="Total"      fill="#0EA5E9" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
