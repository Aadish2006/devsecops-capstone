import React from 'react';

export default function NotificationsModal({ isOpen, onClose, onSelectAlert }) {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      title: '🚨 P1 Latency Spike on API Gateway',
      time: '14 min ago',
      level: 'Critical',
      search: '504',
      bg: '#ffe5df',
      color: '#c85a3c'
    },
    {
      id: 2,
      title: '⚠️ Kubelet MemoryPressure on worker node-2',
      time: '32 min ago',
      level: 'Warning',
      search: 'Memory Pressure',
      bg: '#fff0ba',
      color: '#a07212'
    },
    {
      id: 3,
      title: '✓ Ingress TLS Certificate renewed successfully',
      time: '1 hr ago',
      level: 'Resolved',
      search: 'Certificate',
      bg: '#dff7ed',
      color: '#2f7c50'
    },
    {
      id: 4,
      title: '🛡️ Trivy container scan: 0 High/Critical CVEs',
      time: '2 hrs ago',
      level: 'Info',
      search: '',
      bg: '#ebe6ff',
      color: '#6852d4'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Live Telemetry Alerts</p>
            <h2>System Notifications</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
          {alerts.map((a) => (
            <div
              key={a.id}
              onClick={() => { onSelectAlert(a.search); onClose(); }}
              style={{
                background: a.bg,
                padding: '12px 16px',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ fontSize: '12.5px', color: a.color }}>{a.title}</b>
                <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700 }}>{a.time}</span>
              </div>
              <small style={{ color: a.color, fontSize: '11px', display: 'block', marginTop: '4px' }}>
                Click to inspect affected ticket ↗
              </small>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="submit-btn"
          style={{ width: '100%', margin: 0 }}
          onClick={onClose}
        >
          Dismiss &amp; Close
        </button>
      </div>
    </div>
  );
}
