// src/api/client.js
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getToken() { return localStorage.getItem('token'); }

export async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(`${BASE}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

const api = {
  get:    (ep)       => request(ep, { method: 'GET' }),
  post:   (ep, body) => request(ep, { method: 'POST', body }),
  put:    (ep, body) => request(ep, { method: 'PUT', body }),
  delete: (ep)       => request(ep, { method: 'DELETE' }),
};
export default api;
