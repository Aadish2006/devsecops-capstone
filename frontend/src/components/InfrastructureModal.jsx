import React from 'react';

export default function InfrastructureModal({ isOpen, onClose, onOpenAddService }) {
  if (!isOpen) return null;

  const nodes = [
    { name: 'eks-worker-node-ap-south-1a', ip: '10.0.1.12', cpu: '42%', mem: '58%', status: 'Ready', health: '#52b784' },
    { name: 'eks-worker-node-ap-south-1b', ip: '10.0.2.44', cpu: '78%', mem: '88%', status: 'MemoryPressure', health: '#ed765f' },
    { name: 'eks-control-plane-master', ip: '10.0.0.1', cpu: '18%', mem: '34%', status: 'Healthy', health: '#52b784' },
  ];

  const services = [
    { name: 'Nginx Ingress Controller', port: '80 / 443', type: 'IngressGateway', status: 'Active (504 alert)', color: '#ed765f' },
    { name: 'OpsDesk FastAPI Backend', port: '8000', type: 'REST API & Probes', status: 'Healthy (/health 200)', color: '#52b784' },
    { name: 'OpsDesk React Client', port: '3000', type: 'SPA Web Frontend', status: 'Healthy (/ 200)', color: '#52b784' },
    { name: 'PostgreSQL Database', port: '5432', type: 'Relational DB', status: 'Healthy (Conn: 14/100)', color: '#52b784' },
    { name: 'Prometheus & Grafana', port: '9090 / 3001', type: 'Observability', status: 'Scraping 15s', color: '#52b784' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Cluster Architecture · AWS EKS</p>
            <h2>Infrastructure &amp; Node Status</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)' }}>Kubernetes Cluster Nodes</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {nodes.map((n) => (
              <div
                key={n.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#faf8fd',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #ece7f3',
                  fontSize: '12.5px'
                }}
              >
                <div>
                  <b style={{ display: 'block', color: 'var(--ink)' }}>{n.name}</b>
                  <small style={{ color: 'var(--muted)' }}>IP: {n.ip} · CPU: {n.cpu} · Mem: {n.mem}</small>
                </div>
                <span
                  style={{
                    background: `${n.health}22`,
                    color: n.health,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '11px'
                  }}
                >
                  {n.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)' }}>Active Microservices</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {services.map((s) => (
              <div
                key={s.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fdfcfe',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #f0ecf6',
                  fontSize: '12px'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--ink)' }}>{s.name}</strong>
                  <span style={{ color: 'var(--muted)', marginLeft: '8px' }}>({s.port} · {s.type})</span>
                </div>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => { onClose(); onOpenAddService(); }}
            style={{
              background: '#eeeaff',
              color: '#6852d4',
              padding: '9px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            ⌁ Register New Microservice
          </button>
          <button
            type="button"
            className="submit-btn"
            style={{ width: 'auto', margin: 0, padding: '9px 18px', borderRadius: '12px' }}
            onClick={onClose}
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
