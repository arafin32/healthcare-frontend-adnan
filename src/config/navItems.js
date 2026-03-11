// src/config/navItems.js
// centralized navigation items for the various roles
export const NAV_ITEMS = {
  patient: [
    { to: '/patient/dashboard',     icon: '⊞',  label: 'Dashboard' },
    { to: '/patient/doctors',       icon: '🔍', label: 'Find Doctors' },
    { to: '/patient/appointments',  icon: '📅', label: 'Appointments' },
    { to: '/patient/prescriptions', icon: '💊', label: 'Prescriptions' },
    { to: '/patient/health-metrics',icon: '📊', label: 'Health Metrics' },
    { to: '/patient/lab-results',   icon: '🧪', label: 'Lab Results' },
    { to: '/patient/medications',   icon: '⏰', label: 'Medications' },
    { to: '/patient/medical-images',icon: '🖼️', label: 'Medical Images' },
    { to: '/patient/profile',       icon: '👤', label: 'My Profile' },
  ],
  doctor: [
    { to: '/doctor/dashboard',      icon: '⊞',  label: 'Dashboard' },
    { to: '/doctor/appointments',   icon: '📅', label: 'Appointments' },
    { to: '/doctor/patients',       icon: '🧑‍🤝‍🧑',label: 'My Patients' },
    { to: '/doctor/prescriptions',  icon: '💊', label: 'Prescriptions' },
    { to: '/doctor/profile',        icon: '👤', label: 'My Profile' },
  ],
  admin: [
    { to: '/admin/dashboard',       icon: '⊞',  label: 'Dashboard' },
    { to: '/admin/users',           icon: '👥', label: 'User Management' },
    { to: '/admin/analytics',       icon: '📈', label: 'Analytics' },
  ],
};
