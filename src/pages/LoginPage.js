// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      if      (user.role === 'doctor')  navigate('/doctor/dashboard');
      else if (user.role === 'admin')   navigate('/admin/dashboard');
      else                              navigate('/patient/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-bg">
      <div className="auth-panel">
        <div className="auth-brand">
          <span className="auth-brand-icon">🏥</span>
          <span className="auth-brand-name">HealthCare+</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue to your account</p>

        {error && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••"
              value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:8}} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-divider"><span>New here?</span></div>
        <Link to="/register" className="btn btn-ghost btn-full">Create an account</Link>
      </div>

      {/* Decorative side */}
      <div className="auth-deco">
        <div className="deco-content">
          <div className="deco-icon">🏥</div>
          <h2>Your health, in one place.</h2>
          <p>Book appointments, view prescriptions, track vitals, and stay on top of your health journey.</p>
          <div className="deco-features">
            {['Find & book doctors instantly','View lab results & prescriptions','Track health metrics & vitals','Manage medications & reminders'].map(f=>(
              <div key={f} className="deco-feat">✓ {f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
