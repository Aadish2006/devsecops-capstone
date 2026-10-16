import React from 'react';

export default function Topbar({
  onToggleMenu,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenProfile,
}) {
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
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{ background: 'transparent', color: 'var(--muted)', fontSize: '13px', padding: '0 4px' }}
          >
            ✕
          </button>
        )}
      </label>

      <div className="profile-tools">
        <button
          className="round-btn"
          aria-label="Notifications"
          title="Open Telemetry Notifications"
          onClick={onOpenNotifications}
        >
          ♧
        </button>
        <div
          className="profile-dot"
          title="System online &amp; telemetry active"
          onClick={onOpenNotifications}
          style={{ cursor: 'pointer' }}
        ></div>
        <div
          className="avatar"
          onClick={onOpenProfile}
          style={{ cursor: 'pointer' }}
          title="Open Engineer Command Profile"
        >
          AS
        </div>
      </div>
    </header>
  );
}
