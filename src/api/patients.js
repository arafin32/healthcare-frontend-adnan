// src/api/patients.js
import api from './client';
export const getPatientProfile   = ()       => api.get('/api/v1/patients/profile').then(r=>r.data);
export const updatePatientProfile= (data)   => api.put('/api/v1/patients/profile', data).then(r=>r.data);
export const getPatientDashboard = ()       => api.get('/api/v1/patients/dashboard').then(r=>r.data);
export const getAllPatients       = (p={})  => {
  const q = new URLSearchParams();
  if(p.page)   q.append('page',p.page);
  if(p.limit)  q.append('limit',p.limit);
  if(p.search) q.append('search',p.search);
  const qs = q.toString();
  return api.get(`/api/v1/patients${qs?`?${qs}`:''}`).then(r=>r.data);
};
export const getPatientById = (id) => api.get(`/api/v1/patients/${id}`).then(r=>r.data);
