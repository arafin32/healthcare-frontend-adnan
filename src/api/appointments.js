// src/api/appointments.js
import api from './client';

export const createAppointment = (data) => api.post('/api/v1/appointments', data).then(r => r.data);
export const updateAppointment = (id, data) => api.put(`/api/v1/appointments/${id}`, data).then(r => r.data);
export const cancelAppointment = (id) => updateAppointment(id, { status: 'cancelled' });

export function getMyAppointments(params = {}) {
  const q = new URLSearchParams();
  if (params.status) q.append('status', params.status);
  if (params.page)   q.append('page',   params.page);
  if (params.limit)  q.append('limit',  params.limit);
  const qs = q.toString();
  return api.get(`/api/v1/appointments/my-appointments${qs ? `?${qs}` : ''}`).then(r => r.data);
}
