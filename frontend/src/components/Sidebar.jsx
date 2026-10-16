import React from 'react';

export default function Sidebar({ isOpen, activeNav, setActiveNav }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'outages', label: 'Active Outages', icon: '⚡' },
    { id: 'incidents', label: 'Incidents', icon: '◉' },
    { id: 'slas', label: 'SLAs & Alerts', icon: '◌' },
    { id: 'infra', label: 'Infrastructure', icon: '⌘' },
    { id: 'audit', label: 'System Audit', icon: '◷' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="brand">
        <div className="brand-mark">O</div>
        <div>
          OpsDesk
          <small>Cloud &amp; IT Helpdesk</small>
        </div>
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeNav === item.id ? 'active' : ''}
            onClick={() => setActiveNav(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="side-status">
        <strong>Zero-Downtime SRE</strong>
        <p>All core systems are monitored by Prometheus, Grafana &amp; Kubernetes.</p>
      </div>
      <div className="account">
        <div className="avatar">AS</div>
        <div>
          <b>Aadish Sharma</b>
          <small>DevOps Engineer</small>
        </div>
      </div>
    </aside>
  );
}
