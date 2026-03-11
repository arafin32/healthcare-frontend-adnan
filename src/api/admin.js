// src/api/admin.js
import api from './client';
export const getAnalytics = ()          => api.get('/api/v1/admin/analytics').then(r=>r.data);
export const getAllUsers   = (p={})     => {
  const q = new URLSearchParams();
  if(p.role)    q.append('role',p.role);
  if(p.page)    q.append('page',p.page);
  if(p.limit)   q.append('limit',p.limit);
  if(p.isActive!==undefined) q.append('isActive',p.isActive);
  const qs = q.toString();
  return api.get(`/api/v1/admin/users${qs?`?${qs}`:''}`).then(r=>r.data);
};
export const manageUser = (userId, isActive) => api.put(`/api/v1/admin/users/${userId}/manage`, {isActive}).then(r=>r.data);
export const deleteUser = (userId) => api.delete(`/api/v1/admin/users/${userId}`).then(r=>r.data);
