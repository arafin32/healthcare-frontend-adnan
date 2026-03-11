// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const STEPS = ['Account', 'Personal', 'Role Info'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step,  setStep]  = useState(0);
  const [role,  setRole]  = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email:'', password:'', firstName:'', lastName:'', phoneNumber:'',
    dateOfBirth:'', gender:'male',
    specialization:'', licenseNumber:'', department:'', qualification:'',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (step < 2) { setStep(s=>s+1); return; }
    setError(''); setLoading(true);
    try {
      const payload = { email:form.email, password:form.password, role, firstName:form.firstName, lastName:form.lastName, phoneNumber:form.phoneNumber };
      if (role==='patient') { payload.dateOfBirth=form.dateOfBirth; payload.gender=form.gender; }
      if (role==='doctor')  { payload.specialization=form.specialization; payload.licenseNumber=form.licenseNumber; payload.department=form.department; payload.qualification=form.qualification; }
      await registerUser(payload);
      await login(form.email, form.password);
      navigate(role==='doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch(err) { setError(err.message || 'Registration failed.'); setStep(0); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-bg auth-bg-reg">
      <div className="auth-panel">
        <div className="auth-brand">
          <span className="auth-brand-icon">🏥</span>
          <span className="auth-brand-name">HealthCare+</span>
        </div>
        <h1 className="auth-title">Create account</h1>

        {/* Progress */}
        <div className="auth-steps">
          {STEPS.map((s,i)=>(
            <div key={s} className={`auth-step ${i<=step?'done':''} ${i===step?'active':''}`}>
              <div className="step-dot">{i<step?'✓':i+1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{error}</div>}

        <form onSubmit={handleSubmit}>
          {step===0 && <>
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <div className="role-row">
                {['patient','doctor'].map(r=>(
                  <button key={r} type="button" className={`role-btn ${role===r?'active':''}`} onClick={()=>setRole(r)}>
                    {r==='patient'?'🧑‍⚕️ Patient':'👨‍⚕️ Doctor'}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password (min 6 chars)</label>
              <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e=>set('password',e.target.value)} required minLength={6} />
            </div>
          </>}

          {step===1 && <>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" placeholder="John" value={form.firstName} onChange={e=>set('firstName',e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Doe" value={form.lastName} onChange={e=>set('lastName',e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+880 1XXXXXXXXX" value={form.phoneNumber} onChange={e=>set('phoneNumber',e.target.value)} required />
            </div>
            {role==='patient' && <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" value={form.dateOfBirth} onChange={e=>set('dateOfBirth',e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={e=>set('gender',e.target.value)}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>}
          </>}

          {step===2 && role==='doctor' && <>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input className="form-input" placeholder="e.g. Cardiology" value={form.specialization} onChange={e=>set('specialization',e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">License Number</label>
                <input className="form-input" placeholder="BMDC-XXXXX" value={form.licenseNumber} onChange={e=>set('licenseNumber',e.target.value)} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" placeholder="Internal Medicine" value={form.department} onChange={e=>set('department',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input className="form-input" placeholder="MBBS, MD" value={form.qualification} onChange={e=>set('qualification',e.target.value)} />
              </div>
            </div>
          </>}
          {step===2 && role==='patient' && (
            <div className="auth-review">
              <div className="review-row"><span>Email</span><strong>{form.email}</strong></div>
              <div className="review-row"><span>Name</span><strong>{form.firstName} {form.lastName}</strong></div>
              <div className="review-row"><span>Role</span><strong className="text-teal">{role}</strong></div>
              <div className="review-row"><span>Phone</span><strong>{form.phoneNumber}</strong></div>
            </div>
          )}

          <div className="auth-step-buttons">
            {step>0 && <button type="button" className="btn btn-ghost" onClick={()=>setStep(s=>s-1)}>← Back</button>}
            <button type="submit" className="btn btn-primary" style={{flex:1}} disabled={loading}>
              {step<2 ? 'Next →' : (loading?'Creating…':'Create Account ✓')}
            </button>
          </div>
        </form>

        <div className="auth-divider"><span>Have an account?</span></div>
        <Link to="/login" className="btn btn-ghost btn-full">Sign in instead</Link>
      </div>
    </div>
  );
}
