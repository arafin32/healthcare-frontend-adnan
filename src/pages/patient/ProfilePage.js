// src/pages/patient/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientProfile, updatePatientProfile } from '../../api/patients';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
  });

  const [loading, setLoad] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load profile data
  useEffect(() => {
    getPatientProfile()
      .then((p) => {
        setForm({
          firstName: p?.firstName || '',
          lastName: p?.lastName || '',
          phoneNumber: p?.phoneNumber || '',
          address: p?.address || '',
          bloodGroup: p?.bloodGroup || '',
          dateOfBirth: p?.dateOfBirth
            ? p.dateOfBirth.split('T')[0]
            : '',
          gender: p?.gender || '',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoad(false));
  }, []);

  const set = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Remove empty fields
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, value]) => value !== '')
      );

      if (payload.dateOfBirth) {
        payload.dateOfBirth = new Date(
          payload.dateOfBirth
        ).toISOString();
      }

      const updated = await updatePatientProfile(payload);
      refreshUser(updated);

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Validation failed'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        background: '#f1f5f9',
      }}
    >
      <div style={{ width: '100%', maxWidth: 700 }}>

        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: 20 }}>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Update your personal and medical information
          </p>
        </div>

        {/* Avatar Card */}
        <div
          className="card card-pad"
          style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#14b8a6',
              color: '#fff',
              fontSize: 26,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {(form.firstName?.[0] || '').toUpperCase()}
            {(form.lastName?.[0] || '').toUpperCase()}
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {form.firstName || '—'} {form.lastName || ''}
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              {user?.email}
            </div>
            <span className="badge badge-patient">Patient</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card card-pad">
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    set('phoneNumber', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    set('dateOfBirth', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={(e) =>
                    set('gender', e.target.value)
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={form.bloodGroup}
                  onChange={(e) =>
                    set('bloodGroup', e.target.value)
                  }
                >
                  <option value="">Select blood group</option>
                  {[
                    'A+','A-','B+','B-',
                    'AB+','AB-','O+','O-'
                  ].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  set('address', e.target.value)
                }
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
