// src/pages/admin/AdminUsers.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, manageUser, deleteUser } from '../../api/admin';

const ROLES = ['','patient','doctor','admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [load, setLoad]   = useState(true);
  const [err, setErr]     = useState('');
  const [role, setRole]   = useState('');
  const [page, setPage]   = useState(1);
  const [pag, setPag]     = useState(null);
  const [busy, setBusy]   = useState(null);

  const fetch = useCallback(async()=>{
    setLoad(true); setErr('');
    try { const d=await getAllUsers({role,page,limit:15}); setUsers(d.users||[]); setPag(d.pagination); }
    catch(e){ setErr(e.message); }
    finally{ setLoad(false); }
  },[role,page]);

  useEffect(()=>{ fetch(); },[fetch]);

  async function toggleActive(userId, isActive) {
    if(!window.confirm(`${isActive?'Activate':'Deactivate'} this user?`)) return;
    setBusy(userId);
    try { await manageUser(userId, isActive); fetch(); }
    catch(e){ alert(e.message); }
    finally{ setBusy(null); }
  }

  async function handleDelete(userId) {
    if(!window.confirm('Permanently delete this user? This cannot be undone.')) return;
    setBusy(userId);
    try { await deleteUser(userId); fetch(); }
    catch(e){ alert(e.message); }
    finally{ setBusy(null); }
  }

  const getProfile = (u) => u.patientProfile || u.doctorProfile || u.adminProfile;

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">User Management</h1><p className="page-subtitle">View, activate/deactivate, and manage system users</p></div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {ROLES.map(r=>(
          <button key={r} className={`btn btn-sm ${role===r?'btn-primary':'btn-ghost'}`} onClick={()=>{setRole(r);setPage(1);}}>
            {r||'All Roles'}
          </button>
        ))}
      </div>

      {err  && <div className="alert alert-error">{err}</div>}
      {load && <div className="spinner-wrap"><div className="spinner"/></div>}

      {!load && !err && (
        <>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.length===0
                  ? <tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'40px'}}>No users found.</td></tr>
                  : users.map(u=>{
                    const p = getProfile(u);
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{width:34,height:34,borderRadius:'50%',background:`hsl(${(u.id||'').charCodeAt(0)*7%360},60%,55%)`,color:'#fff',fontWeight:800,fontFamily:'var(--font-display)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                              {p?.firstName?.[0]}{p?.lastName?.[0]}
                            </div>
                            <div>
                              <div style={{fontWeight:600,fontSize:13.5}}>{p?`${p.firstName} ${p.lastName}`:'—'}</div>
                              {u.role==='doctor' && p?.specialization && <div style={{fontSize:11.5,color:'var(--teal)'}}>{p.specialization}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{color:'var(--text-muted)'}}>{u.email}</td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td>
                          <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12.5,fontWeight:600,color:u.isActive?'var(--green)':'var(--rose)'}}>
                            <span style={{width:7,height:7,borderRadius:'50%',background:u.isActive?'var(--green)':'var(--rose)',display:'inline-block'}}/>
                            {u.isActive?'Active':'Inactive'}
                          </span>
                        </td>
                        <td style={{color:'var(--text-muted)',fontSize:12.5}}>{u.lastLogin?new Date(u.lastLogin).toLocaleDateString():'Never'}</td>
                        <td>
                          <div style={{display:'flex',gap:6}}>
                            <button className={`btn btn-sm ${u.isActive?'btn-warning':'btn-success'}`} onClick={()=>toggleActive(u.id,!u.isActive)} disabled={busy===u.id}>
                              {busy===u.id?'…':u.isActive?'Deactivate':'Activate'}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(u.id)} disabled={busy===u.id}>
                              {busy===u.id?'…':'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {pag && pag.totalPages>1 && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,marginTop:20}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>p-1)} disabled={page===1}>← Prev</button>
              <span className="text-muted text-sm">Page {page} / {pag.totalPages} · {pag.total} users</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>p+1)} disabled={page===pag.totalPages}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
