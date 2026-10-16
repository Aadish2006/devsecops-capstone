import React from 'react';

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Engineer Profile</p>
            <h2>On-Call Command</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '14px', background: '#faf8fd', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '16px' }}>AS</div>
          <div>
            <b style={{ fontSize: '15px', color: 'var(--ink)', display: 'block' }}>Aadish Sharma</b>
            <span style={{ fontSize: '12px', color: '#6852d4', fontWeight: 700 }}>Lead DevOps &amp; SRE Engineer</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '8px', marginBottom: '20px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f5f0ff', borderRadius: '10px' }}>
            <span style={{ color: '#5b5372', fontWeight: 600 }}>On-Call Rotation:</span>
            <strong style={{ color: '#52b784' }}>● Active (Primary Tier 1)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fcfbfe', border: '1px solid var(--line)', borderRadius: '10px' }}>
            <span style={{ color: '#5b5372', fontWeight: 600 }}>EKS Cluster:</span>
            <strong>ap-south-1-eks (v1.31)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fcfbfe', border: '1px solid var(--line)', borderRadius: '10px' }}>
            <span style={{ color: '#5b5372', fontWeight: 600 }}>Observability:</span>
            <strong>Prometheus + Grafana Live</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className="row-action"
            style={{ width: '100%', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}
            onClick={() => window.open('http://localhost:8000/docs', '_blank')}
          >
            FastAPI Docs ↗
          </button>
          <button
            type="button"
            className="submit-btn"
            style={{ width: '100%', margin: 0, padding: '10px', borderRadius: '12px', fontSize: '11px' }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
