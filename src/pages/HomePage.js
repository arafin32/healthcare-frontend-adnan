// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="container home-nav-inner">
          <div className="home-logo">🏥 <span>HealthCare+</span></div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            {user
              ? <Link to={`/${user.role}/dashboard`} className="btn btn-primary btn-sm">Go to Dashboard →</Link>
              : <><Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link><Link to="/register" className="btn btn-primary btn-sm">Get Started</Link></>
            }
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-tag">🏥 Comprehensive Healthcare Platform</div>
          <h1 className="hero-h1">Your health,<br/><em>fully managed.</em></h1>
          <p className="hero-p">Book appointments with top doctors, track your vitals, view lab results, manage prescriptions — all in one secure, easy-to-use platform.</p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-primary btn-lg">Start for Free →</Link>
            <Link to="/login" className="btn" style={{background:'rgba(255,255,255,.15)',color:'#fff',backdropFilter:'blur(8px)'}}>Sign In</Link>
          </div>
        </div>
        <div className="hero-float-cards">
          {[{icon:'📅',t:'Appointments',d:'Book in seconds'},{icon:'💊',t:'Prescriptions',d:'Track digitally'},{icon:'📊',t:'Health Metrics',d:'Monitor trends'},{icon:'🧪',t:'Lab Results',d:'View securely'}].map(c=>(
            <div key={c.t} className="float-card">
              <span style={{fontSize:22}}>{c.icon}</span>
              <div><div style={{fontWeight:700,fontSize:13}}>{c.t}</div><div style={{fontSize:11.5,opacity:.7}}>{c.d}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontSize:32,fontWeight:800,fontFamily:'var(--font-display)',marginBottom:10}}>Everything you need</h2>
            <p style={{color:'var(--text-muted)',fontSize:15}}>For patients, doctors, and administrators — in one place.</p>
          </div>
          <div className="grid-3" style={{gap:24}}>
            {[
              { icon:'🔍', color:'var(--teal)',    title:'Find Doctors',          desc:'Search by name or specialization. View qualifications and book instantly.' },
              { icon:'📅', color:'var(--sky)',     title:'Book Appointments',     desc:'Pick your preferred date and time slot. Get instant confirmation.' },
              { icon:'💊', color:'var(--purple)',  title:'Digital Prescriptions', desc:'Doctors create digital prescriptions. Patients access them anytime.' },
              { icon:'📊', color:'var(--amber)',   title:'Health Monitoring',     desc:'Track BMI, blood pressure, heart rate. See trends with charts.' },
              { icon:'🧪', color:'var(--green)',   title:'Lab Results',           desc:'Lab results uploaded by your doctor. View and download securely.' },
              { icon:'⏰', color:'var(--rose)',    title:'Medication Reminders',  desc:'Set your medication schedule. Never miss a dose.' },
              { icon:'🖼️', color:'var(--navy)',   title:'Medical Images',        desc:'Upload X-rays, MRIs, CT scans. Doctors can view and annotate.' },
              { icon:'👥', color:'var(--teal)',    title:'Admin Control',         desc:'Full user management, analytics, and role-based access control.' },
              { icon:'🔒', color:'var(--sky)',     title:'Secure & Private',      desc:'JWT authentication, encrypted data, role-based permissions.' },
            ].map(f=>(
              <div key={f.title} className="feature-tile">
                <div className="ft-icon" style={{'--ftc':f.color}}>{f.icon}</div>
                <h3 className="ft-title">{f.title}</h3>
                <p className="ft-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="home-roles">
        <div className="container">
          <h2 style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)',marginBottom:28,textAlign:'center'}}>Built for every role</h2>
          <div className="grid-3" style={{gap:20}}>
            {[
              { role:'Patient', icon:'🧑‍⚕️', color:'var(--teal-pale)', border:'var(--teal-light)', items:['Search & book doctors','View appointments & history','Access prescriptions & lab results','Track health metrics & vitals','Manage medications & reminders','Upload medical images'] },
              { role:'Doctor',  icon:'👨‍⚕️', color:'#EFF6FF',         border:'#BAE6FD',           items:['View today\'s appointments','Confirm or complete appointments','Access patient records','Create digital prescriptions','Manage patient list','Professional profile'] },
              { role:'Admin',   icon:'⚙️',  color:'var(--purple-light)', border:'#C4B5FD',         items:['System-wide analytics','User management & roles','Activate/deactivate accounts','View appointment statistics','Monitor platform health','Full audit control'] },
            ].map(r=>(
              <div key={r.role} className="role-tile" style={{background:r.color,border:`1px solid ${r.border}`}}>
                <div style={{fontSize:36,marginBottom:10}}>{r.icon}</div>
                <h3 style={{fontSize:18,fontWeight:800,fontFamily:'var(--font-display)',marginBottom:14}}>{r.role}</h3>
                {r.items.map(i=><div key={i} style={{fontSize:13,color:'var(--text-body)',padding:'5px 0',borderBottom:'1px solid rgba(0,0,0,.06)',display:'flex',gap:8}}><span style={{color:'var(--teal)',flexShrink:0}}>✓</span>{i}</div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontSize:32,fontWeight:800,fontFamily:'var(--font-display)',color:'#fff',marginBottom:12}}>Ready to get started?</h2>
          <p style={{color:'rgba(255,255,255,.75)',fontSize:16,marginBottom:28}}>Join thousands of patients and doctors using HealthCare+</p>
          <Link to="/register" className="btn btn-lg" style={{background:'#fff',color:'var(--teal-dark)',fontWeight:800}}>Create Free Account →</Link>
        </div>
      </section>
    </div>
  );
}
