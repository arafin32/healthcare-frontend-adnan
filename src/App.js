// src/App.js — All routes for the entire app
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';

// Public pages
import HomePage    from './pages/HomePage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Patient pages
import PatientDashboard  from './pages/patient/PatientDashboard';
import DoctorsPage       from './pages/patient/DoctorsPage';
import AppointmentsPage  from './pages/patient/AppointmentsPage';
import PrescriptionsPage from './pages/patient/PrescriptionsPage';
import ProfilePage       from './pages/patient/ProfilePage';
import HealthMetricsPage from './pages/patient/HealthMetricsPage';
import LabResultsPage    from './pages/patient/LabResultsPage';
import MedicationsPage   from './pages/patient/MedicationsPage';
import MedicalImagesPage from './pages/patient/MedicalImagesPage';

// Doctor pages
import DoctorDashboard    from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients     from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorProfile      from './pages/doctor/DoctorProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

/* ─── Route guards ─── */

// Requires login
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

// Requires specific role
function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!user)             return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}

/* ─── Dashboard layout with top navigation ─── */
function DashboardLayout({ role, children }) {
  return (
    <RequireRole role={role}>
      <div className="app-shell has-navbar">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </RequireRole>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login"    element={user ? <Navigate to={`/${user.role}/dashboard`}/> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`}/> : <RegisterPage />} />

      {/* Patient routes */}
      <Route path="/patient/dashboard"      element={<DashboardLayout role="patient"><PatientDashboard/></DashboardLayout>} />
      <Route path="/patient/doctors"        element={<DashboardLayout role="patient"><DoctorsPage/></DashboardLayout>} />
      <Route path="/patient/appointments"   element={<DashboardLayout role="patient"><AppointmentsPage/></DashboardLayout>} />
      <Route path="/patient/prescriptions"  element={<DashboardLayout role="patient"><PrescriptionsPage/></DashboardLayout>} />
      <Route path="/patient/profile"        element={<DashboardLayout role="patient"><ProfilePage/></DashboardLayout>} />
      <Route path="/patient/health-metrics" element={<DashboardLayout role="patient"><HealthMetricsPage/></DashboardLayout>} />
      <Route path="/patient/lab-results"    element={<DashboardLayout role="patient"><LabResultsPage/></DashboardLayout>} />
      <Route path="/patient/medications"    element={<DashboardLayout role="patient"><MedicationsPage/></DashboardLayout>} />
      <Route path="/patient/medical-images" element={<DashboardLayout role="patient"><MedicalImagesPage/></DashboardLayout>} />

      {/* Doctor routes */}
      <Route path="/doctor/dashboard"      element={<DashboardLayout role="doctor"><DoctorDashboard/></DashboardLayout>} />
      <Route path="/doctor/appointments"   element={<DashboardLayout role="doctor"><DoctorAppointments/></DashboardLayout>} />
      <Route path="/doctor/patients"       element={<DashboardLayout role="doctor"><DoctorPatients/></DashboardLayout>} />
      <Route path="/doctor/prescriptions"  element={<DashboardLayout role="doctor"><DoctorPrescriptions/></DashboardLayout>} />
      <Route path="/doctor/profile"        element={<DashboardLayout role="doctor"><DoctorProfile/></DashboardLayout>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard"  element={<DashboardLayout role="admin"><AdminDashboard/></DashboardLayout>} />
      <Route path="/admin/users"      element={<DashboardLayout role="admin"><AdminUsers/></DashboardLayout>} />
      <Route path="/admin/analytics"  element={<DashboardLayout role="admin"><AdminAnalytics/></DashboardLayout>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
