// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

import { NAV_ITEMS } from '../config/navItems';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const items = NAV_ITEMS[user?.role] || [];
  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  // close mobile menu when navigating
  function onLinkClick() {
    if (mobileOpen) setMobileOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo-icon">🏥</span>
        <span className="logo-text">HealthCare+</span>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Menu"
      >
        ☰
      </button>

      <nav className={`navbar-nav${mobileOpen ? ' open' : ''}`}>
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onLinkClick}
          >
            {/* icons removed for simplicity */}
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="navbar-right">
        <span className="user-name">{fullName}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: 12 }}>
          Logout
        </button>
      </div>
    </header>
  );
}
