// src/api/prescriptions.js
import api from './client';
export const getMyPrescriptions       = (p={}) => api.get(`/api/v1/prescriptions/my-prescriptions${p.status?`?status=${p.status}`:''}`).then(r=>r.data);
export const getPatientPrescriptions  = (pid)  => api.get(`/api/v1/prescriptions/patient/${pid}`).then(r=>r.data);
export const createPrescription       = (data) => api.post('/api/v1/prescriptions', data).then(r=>r.data);
export const updatePrescription       = (id,data) => api.put(`/api/v1/prescriptions/${id}`, data).then(r=>r.data);
export const getPrescriptionById      = (id)   => api.get(`/api/v1/prescriptions/${id}`).then(r=>r.data);
