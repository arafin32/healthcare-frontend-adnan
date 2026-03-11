// src/api/doctors.js
import api from './client';

export function getDoctors(params = {}) {
  const q = new URLSearchParams();
  if (params.page)           q.append('page', params.page);
  if (params.limit)          q.append('limit', params.limit);
  if (params.search)         q.append('search', params.search);
  if (params.specialization) q.append('specialization', params.specialization);
  const qs = q.toString();
  return api.get(`/api/v1/doctors${qs ? `?${qs}` : ''}`).then(r => r.data);
}

export const getDoctorById    = (id) => api.get(`/api/v1/doctors/${id}`).then(r => r.data);
export const getDoctorProfile = ()   => api.get('/api/v1/doctors/profile').then(r => r.data);
export const updateDoctorProfile = (data) => api.put('/api/v1/doctors/profile', data).then(r => r.data);
export const getDoctorDashboard  = ()     => api.get('/api/v1/doctors/dashboard').then(r => r.data);
