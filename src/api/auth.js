// src/api/auth.js
import api from './client';
export const registerUser  = (data)     => api.post('/api/v1/auth/register', data).then(r => r.data);
export const loginUser     = (e, p)     => api.post('/api/v1/auth/login', {email:e,password:p}).then(r => r.data);
export const getMyProfile  = ()         => api.get('/api/v1/auth/profile').then(r => r.data);
export const logoutUser    = async ()   => { try{ await api.post('/api/v1/auth/logout'); }catch{} localStorage.removeItem('token'); localStorage.removeItem('user'); };
