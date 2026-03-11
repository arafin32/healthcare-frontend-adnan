// src/pages/patient/MedicalImagesPage.js
// Medical image upload/view. Backend has /api/v1/medical-images/upload route.
import React, { useState } from 'react';

const DEMO_IMAGES = [
  { id:1, type:'X-Ray',  label:'Chest X-Ray',    date:'2026-01-15', doctor:'Dr. Patel',   note:'No abnormalities detected. Clear lung fields.', icon:'🩻' },
  { id:2, type:'MRI',    label:'Brain MRI',       date:'2025-11-20', doctor:'Dr. Williams',note:'Normal brain MRI. No evidence of intracranial pathology.', icon:'🧠' },
  { id:3, type:'CT Scan',label:'Abdominal CT',    date:'2025-09-05', doctor:'Dr. Chen',    note:'No significant findings. Liver and kidneys appear normal.', icon:'💠' },
];

const IMG_TYPES = ['X-Ray','MRI','CT Scan','Ultrasound','ECG','Other'];

export default function MedicalImagesPage() {
  const [images, setImages] = useState(DEMO_IMAGES);
  const [showUp, setShow]   = useState(false);
  const [form, setForm]     = useState({ type:'X-Ray', label:'', note:'' });
  const [file, setFile]     = useState(null);
  const [uploading, setUpl] = useState(false);
  const [selected, setSel]  = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUpl(true);
    // Simulate upload (real upload would use FormData to POST /api/v1/medical-images/upload)
    await new Promise(r=>setTimeout(r,1200));
    setImages(imgs=>[...imgs, { id:Date.now(), type:form.type, label:form.label||`${form.type} - ${new Date().toLocaleDateString()}`, date:new Date().toISOString().split('T')[0], doctor:'Uploaded by you', note:form.note, icon:'🖼️' }]);
    setForm({ type:'X-Ray',label:'',note:'' }); setFile(null); setShow(false); setUpl(false);
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Medical Images</h1><p className="page-subtitle">Upload and view your X-rays, MRIs, CT scans and other medical images</p></div>
        <button className="btn btn-primary" onClick={()=>setShow(!showUp)}>⬆ Upload Image</button>
      </div>

      {showUp && (
        <div className="card card-pad" style={{marginBottom:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14,fontFamily:'var(--font-display)'}}>Upload Medical Image</h3>
          <form onSubmit={handleUpload}>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Image Type</label>
                <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {IMG_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Label / Description</label><input className="form-input" placeholder="e.g. Left Knee X-Ray" value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}/></div>
            </div>
            <div className="form-group">
              <label className="form-label">Image File</label>
              <div style={{border:'2px dashed var(--border)',borderRadius:'var(--r)',padding:'24px',textAlign:'center',cursor:'pointer',background:file?'var(--teal-pale)':'var(--surface)'}} onClick={()=>document.getElementById('img-inp').click()}>
                <input id="img-inp" type="file" accept="image/*,.pdf,.dcm" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                {file ? <div>✅ <strong>{file.name}</strong></div> : <div style={{color:'var(--text-muted)'}}>📎 Click to select image<br/><span style={{fontSize:12}}>JPG, PNG, PDF, DICOM accepted</span></div>}
              </div>
            </div>
            <div className="form-group"><label className="form-label">Notes (optional)</label><textarea className="form-textarea" rows={2} placeholder="Any notes for your doctor…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/></div>
            <div style={{display:'flex',gap:10}}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!file||uploading}>{uploading?'Uploading…':'Upload Image'}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-3">
        {images.map(img=>(
          <div key={img.id} className="card" style={{cursor:'pointer',transition:'box-shadow .18s,transform .18s'}} onClick={()=>setSel(img)}>
            <div style={{height:130,background:`linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)`,borderRadius:'var(--r-lg) var(--r-lg) 0 0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52}}>
              {img.icon}
            </div>
            <div style={{padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--teal)'}}>{img.type}</span>
                <span style={{fontSize:11,color:'var(--text-faint)'}}>{new Date(img.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
              </div>
              <div style={{fontSize:14,fontWeight:700,fontFamily:'var(--font-display)',marginBottom:3}}>{img.label}</div>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>{img.doctor}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={()=>setSel(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">{selected.label}</div><div className="text-muted text-sm">{selected.type} · {selected.doctor}</div></div>
              <button className="modal-close" onClick={()=>setSel(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{height:200,background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',borderRadius:'var(--r)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:64,marginBottom:16}}>
                {selected.icon}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div style={{background:'var(--surface)',padding:'10px 14px',borderRadius:'var(--r)'}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3}}>Date</div>
                  <div style={{fontWeight:600}}>{new Date(selected.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
                </div>
                <div style={{background:'var(--surface)',padding:'10px 14px',borderRadius:'var(--r)'}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3}}>Uploaded by</div>
                  <div style={{fontWeight:600}}>{selected.doctor}</div>
                </div>
              </div>
              {selected.note && <div style={{background:'var(--teal-pale)',border:'1px solid var(--teal-light)',borderRadius:'var(--r)',padding:'12px 16px'}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:'var(--teal-dark)',marginBottom:4}}>Doctor's Notes</div>
                <p style={{fontSize:13.5,color:'var(--text-body)',lineHeight:1.6}}>{selected.note}</p>
              </div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setSel(null)}>Close</button>
              <button className="btn btn-primary" onClick={()=>alert('Download feature coming soon!')}>⬇ Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
