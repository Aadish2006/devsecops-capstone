import React from 'react';

export default function Topbar({ onToggleMenu, searchQuery, onSearchChange }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onToggleMenu} aria-label="Open navigation">
        ☰
      </button>
      <label className="search">
        ⌕
        <input
          id="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search incidents, services, or people…"
        />
      </label>
      <div className="profile-tools">
        <button className="round-btn" aria-label="Notifications" title="All alerts operational">
          ♧
        </button>
        <div className="profile-dot" title="System online"></div>
        <div className="avatar">AS</div>
      </div>
    </header>
  );
}
