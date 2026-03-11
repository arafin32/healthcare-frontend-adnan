// src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

import { NAV_ITEMS } from '../config/navItems';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const items = NAV_ITEMS[user?.role] || [];
  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email;
  const roleLabel = user?.role || '';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">🏥</span>
        {!collapsed && <span className="logo-text">HealthCare+</span>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* User pill */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">{fullName?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{fullName}</div>
            <span className={`badge badge-${roleLabel}`}>{roleLabel}</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="nav-item nav-logout" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
