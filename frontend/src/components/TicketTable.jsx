import React from 'react';

export default function TicketTable({
  tickets,
  filter,
  onFilterChange,
  onAdvanceStatus,
  onDeleteTicket,
  onInspectTicket,
  loading,
}) {
  const tabs = [
    { id: 'all', label: 'All tickets' },
    { id: 'open', label: 'Open' },
    { id: 'progress', label: 'In progress' },
    { id: 'resolved', label: 'Resolved' },
  ];

  const getDotColor = (priority, status) => {
    const s = (status || '').toUpperCase();
    const p = (priority || '').toUpperCase();
    if (s === 'RESOLVED' || s === 'DONE') return '#52b784';
    if (p === 'CRITICAL' || p === 'HIGH' || s === 'OPEN') return '#ed765f';
    if (s === 'IN_PROGRESS') return '#d49a28';
    return '#7b67d9';
  };

  const getUrgencyClass = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'critical' || p === 'high') return 'critical';
    if (p === 'medium') return 'medium';
    return 'low';
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved' || s === 'done') return 'resolved';
    if (s === 'in_progress') return 'progress';
    return 'open';
  };

  return (
    <section className="card tickets">
      <div className="ticket-head">
        <div>
          <h2>Incident tickets</h2>
          <p>Track customer issues, cloud alerts, and service outages.</p>
        </div>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={filter === tab.id ? 'selected' : ''}
              onClick={() => onFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          {filter === 'outages' && (
            <button
              className="selected"
              style={{ background: '#f47761', color: 'white', borderColor: '#f47761' }}
              onClick={() => onFilterChange('all')}
              title="Click to reset to all tickets"
            >
              ⚡ Outages (P1/P2) ✕
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading tickets from cloud backend…</div>
        ) : !tickets.length ? (
          <div className="empty-state">No incident tickets found matching criteria.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Incident ticket</th>
                <th>Assigned engineer</th>
                <th>Urgency</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td style={{ cursor: 'pointer' }} onClick={() => onInspectTicket(t)}>
                    <div className="issue">
                      <i
                        className="severity-dot"
                        style={{ background: getDotColor(t.priority, t.status) }}
                      />
                      <div>
                        <b>{t.title}</b>
                        <small>{t.description || 'No additional logs provided.'}</small>
                      </div>
                    </div>
                  </td>
                  <td className="assignee">{t.assignee || 'Unassigned'}</td>
                  <td>
                    <span className={`pill ${getUrgencyClass(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${getStatusClass(t.status)}`}>
                      {(t.status || 'OPEN').replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="row-action"
                        onClick={() => onInspectTicket(t)}
                        title="Inspect full incident details"
                      >
                        ↗
                      </button>
                      <button
                        className="row-action"
                        onClick={() => onAdvanceStatus(t)}
                        title="Advance status (Open → In Progress → Resolved)"
                      >
                        ↻
                      </button>
                      <button
                        className="row-action delete"
                        onClick={() => onDeleteTicket(t.id)}
                        title="Delete ticket"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
