// src/pages/patient/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPatientDashboard } from '../../api/patients';
import { getMyAppointments } from '../../api/appointments';
import StatCard from '../../components/StatCard';
import './PatientDashboard.css';

function fmtDate(d) { return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [apts,    setApts]    = useState([]);
  const [loading, setLoading] = useState(true);
  const name = user?.profile ? `${user.profile.firstName}` : 'there';
  function getGreetingColor() {
    const h = new Date().getHours();
    // morning: deeper yellow-green, afternoon: burnt orange, evening: deep purple
    const hue = h < 12 ? 60 : h < 17 ? 30 : 270;
    // use lower lightness for darker color and high saturation for vibrance
    return `hsl(${hue}, 85%, 30%)`;
  }

  useEffect(() => {
    Promise.all([
      getPatientDashboard().catch(()=>null),
      getMyAppointments({ limit: 5 }).catch(()=>({ appointments:[] })),
    ]).then(([dash, aptData]) => {
      setData(dash);
      setApts(aptData?.appointments || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-content"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  const upcoming   = apts.filter(a=>['pending','confirmed'].includes(a.status));
  const active_rx  = data?.activePrescriptions || [];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1
            className="page-title greeting-large typing"
            style={{
              color: getGreetingColor(),
              animation: 'greet-effect 4s ease-in-out infinite alternate'
            }}
          >
            Good {getGreeting()}, {name}! 👋
          </h1>
          <p className="page-subtitle">Here's an overview of your health today.</p>
        </div>
        <Link to="/patient/doctors" className="btn btn-primary">+ Book Appointment</Link>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-4">
        <StatCard icon="📅" label="Upcoming Appointments" value={upcoming.length}     color="teal"   />
        <StatCard icon="💊" label="Active Prescriptions"  value={active_rx.length}    color="sky"    />
        <StatCard icon="🧪" label="Lab Results"           value="—"                   color="green"  sub="Track your tests"/>
        <StatCard icon="📊" label="Health Score"          value="Good"                color="amber"  sub="Based on recent data"/>
      </div>

      <div className="dash-grid">
        {/* Upcoming appointments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Appointments</span>
            <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="card-body" style={{padding:'0'}}>
            {upcoming.length===0
              ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No upcoming appointments</div><div className="empty-desc"><Link to="/patient/doctors" style={{color:'var(--teal)'}}>Find a doctor</Link> to book one.</div></div>
              : upcoming.map(apt => (
                <div key={apt.id} className="dash-apt-row">
                  <div className="dash-apt-date">
                    <div className="dash-apt-day">{new Date(apt.appointmentDate).getDate()}</div>
                    <div className="dash-apt-mon">{new Date(apt.appointmentDate).toLocaleDateString('en-US',{month:'short'})}</div>
                  </div>
                  <div className="dash-apt-info">
                    <div className="dash-apt-who">Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</div>
                    <div className="dash-apt-spec">{apt.doctor?.specialization} · {apt.appointmentTime}</div>
                  </div>
                  <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Prescriptions</span>
            <Link to="/patient/prescriptions" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="card-body" style={{padding:'0'}}>
            {active_rx.length===0
              ? <div className="empty-state"><div className="empty-icon">💊</div><div className="empty-title">No active prescriptions</div></div>
              : active_rx.map(rx => (
                <div key={rx.id} className="dash-rx-row">
                  <div className="dash-rx-icon">💊</div>
                  <div>
                    <div className="dash-rx-diag">{rx.diagnosis}</div>
                    <div className="dash-rx-doc">Dr. {rx.doctor?.firstName} {rx.doctor?.lastName} · {fmtDate(rx.prescriptionDate)}</div>
                  </div>
                  <span className="badge badge-active">Active</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Quick links */}
        <div className="card">
          <div className="card-header"><span className="card-title">Quick Actions</span></div>
          <div className="card-body">
            <div className="quick-links">
              {[
                { to:'/patient/doctors',        icon:'🔍', label:'Find a Doctor',       desc:'Search by name or specialty' },
                { to:'/patient/health-metrics', icon:'📊', label:'Log Health Metrics',  desc:'Track BMI, BP, heart rate' },
                { to:'/patient/lab-results',    icon:'🧪', label:'View Lab Results',    desc:'See your test reports' },
                { to:'/patient/medications',    icon:'⏰', label:'Medication Reminders', desc:'Set your schedule' },
                { to:'/patient/medical-images', icon:'🖼️', label:'Medical Images',      desc:'Upload X-rays & scans' },
              ].map(l=>(
                <Link key={l.to} to={l.to} className="quick-link">
                  <span className="ql-icon">{l.icon}</span>
                  <div><div className="ql-label">{l.label}</div><div className="ql-desc">{l.desc}</div></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h<12) return 'morning'; if (h<17) return 'afternoon'; return 'evening';
}
