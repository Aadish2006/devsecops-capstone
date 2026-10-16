import React from 'react';

export default function TicketDetailModal({ ticket, onClose, onAdvanceStatus, onDeleteTicket }) {
  if (!ticket) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Incident Details · Ticket #{ticket.id}</p>
            <h2>{ticket.title}</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <span className={`pill ${(ticket.priority || 'medium').toLowerCase()}`}>
            Priority: {ticket.priority}
          </span>
          <span className={`pill ${(ticket.status || 'open').toLowerCase()}`}>
            Status: {(ticket.status || 'OPEN').replace('_', ' ')}
          </span>
          <span className="pill" style={{ background: '#eeeaff', color: '#6852d4' }}>
            Assignee: {ticket.assignee || 'Unassigned'}
          </span>
        </div>

        <div style={{ background: '#faf8fd', border: '1px solid #e7e0f2', borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
          <strong style={{ display: 'block', fontSize: '12px', color: '#5b5372', marginBottom: '6px' }}>
            Technical Description &amp; Symptoms
          </strong>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: '1.5' }}>
            {ticket.description || 'No additional logs or replication steps provided.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '12px' }}>
          <div style={{ background: '#fcfbfe', border: '1px solid var(--line)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10px', fontWeight: 700 }}>INFRASTRUCTURE TARGET</span>
            <strong style={{ color: 'var(--ink)' }}>AWS EKS · ap-south-1 (Production)</strong>
          </div>
          <div style={{ background: '#fcfbfe', border: '1px solid var(--line)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10px', fontWeight: 700 }}>REPORTED TIMESTAMP</span>
            <strong style={{ color: 'var(--ink)' }}>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'Just now'}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="row-action delete"
            style={{ width: 'auto', padding: '8px 14px', borderRadius: '12px', color: '#d75d49', background: '#ffe8e3' }}
            onClick={() => { onDeleteTicket(ticket.id); onClose(); }}
          >
            ✕ Delete Ticket
          </button>
          <button
            type="button"
            className="submit-btn"
            style={{ width: 'auto', margin: 0, padding: '10px 18px', borderRadius: '12px' }}
            onClick={() => { onAdvanceStatus(ticket); onClose(); }}
          >
            ↻ Advance Status
          </button>
        </div>
      </div>
    </div>
  );
}
