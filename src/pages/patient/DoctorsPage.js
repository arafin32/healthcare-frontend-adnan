// src/pages/patient/DoctorsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getDoctors } from '../../api/doctors';
import DoctorCard from '../../components/DoctorCard';
import BookingModal from '../../components/BookingModal';
import './DoctorsPage.css';

const SPECS = ['','Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Gynecology','Ophthalmology','ENT','Psychiatry','Oncology','General Medicine','Surgery','Radiology'];

export default function DoctorsPage() {
  const [doctors, setDoctors]   = useState([]);
  const [pagination, setPag]    = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [spec, setSpec]         = useState('');
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess]   = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const d = await getDoctors({ search, specialization:spec, page, limit:9 });
      setDoctors(d.doctors); setPag(d.pagination);
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  }, [search, spec, page]);

  useEffect(() => { fetch(); }, [fetch]);

  function handleBook(doc) { if(!doc) return; setSelected(doc); setSuccess(false); }
  function handleSuccess() { setSelected(null); setSuccess(true); setTimeout(()=>setSuccess(false),5000); }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Find a Doctor</h1>
          <p className="page-subtitle">Search from our network of qualified healthcare professionals</p>
        </div>
      </div>

      {success && <div className="alert alert-success"><span className="alert-icon">✅</span>Appointment booked! Check <a href="/patient/appointments" style={{color:'var(--green)',fontWeight:600}}>My Appointments</a>.</div>}

      {/* Search bar */}
      <div className="search-row">
        <input type="text" className="form-input search-inp"
          placeholder="🔍  Search by doctor name or department..."
          value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
        />
        <select className="form-select" style={{width:200}} value={spec}
          onChange={e=>{setSpec(e.target.value);setPage(1);}}>
          {SPECS.map(s=><option key={s} value={s}>{s||'All Specializations'}</option>)}
        </select>
        <button className="btn btn-primary" onClick={fetch}>Search</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner"/></div>}

      {!loading && !error && (<>
        {doctors.length===0
          ? <div className="empty-state"><div className="empty-icon">🩺</div><div className="empty-title">No doctors found</div><div className="empty-desc">Try a different search or specialization.</div></div>
          : <>
            <p className="text-muted text-sm mb-4">Showing {doctors.length} of {pagination?.total||0} doctors</p>
            <div className="doctors-grid">
              {doctors.map(d=><DoctorCard key={d.id} doctor={d} onBook={handleBook}/>)}
            </div>
          </>
        }
        {pagination?.totalPages>1 && (
          <div className="pager">
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>p-1)} disabled={page===1}>← Prev</button>
            <span className="text-muted text-sm">Page {page} / {pagination.totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>p+1)} disabled={page===pagination.totalPages}>Next →</button>
          </div>
        )}
      </>)}

      {selected && <BookingModal doctor={selected} onClose={()=>setSelected(null)} onSuccess={handleSuccess}/>}
    </div>
  );
}
