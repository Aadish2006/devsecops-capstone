import React from 'react';

export default function Metrics({ stats, currentFilter, onSelectFilter }) {
  const total = stats.total || 0;
  const open = stats.open || 0;
  const inProgress = stats.inProgress || 0;
  const resolved = stats.resolved || 0;

  return (
    <section className="metrics">
      <article
        className="card metric"
        onClick={() => onSelectFilter('all')}
        style={{ cursor: 'pointer', outline: currentFilter === 'all' ? '2px solid var(--purple)' : 'none' }}
        title="Filter: All Incidents"
      >
        <div className="metric-icon">▦</div>
        <small>Total Incidents</small>
        <b>{total < 10 ? `0${total}` : total}</b>
        <span className="delta">↑ 12% this week</span>
      </article>

      <article
        className="card metric"
        onClick={() => onSelectFilter('open')}
        style={{ cursor: 'pointer', outline: currentFilter === 'open' ? '2px solid var(--coral)' : 'none' }}
        title="Filter: Open Tickets"
      >
        <div className="metric-icon">◌</div>
        <small>Open Tickets</small>
        <b>{open < 10 ? `0${open}` : open}</b>
        <span className="delta">↓ 3 since yesterday</span>
      </article>

      <article
        className="card metric"
        onClick={() => onSelectFilter('progress')}
        style={{ cursor: 'pointer', outline: currentFilter === 'progress' ? '2px solid #8a77ea' : 'none' }}
        title="Filter: In Progress"
      >
        <div className="metric-icon">◷</div>
        <small>In Progress</small>
        <b>{inProgress < 10 ? `0${inProgress}` : inProgress}</b>
        <span className="delta">↑ 2 need review</span>
      </article>

      <article
        className="card metric"
        onClick={() => onSelectFilter('resolved')}
        style={{ cursor: 'pointer', outline: currentFilter === 'resolved' ? '2px solid #52b784' : 'none' }}
        title="Filter: Resolved"
      >
        <div className="metric-icon">✓</div>
        <small>Resolved</small>
        <b>{resolved < 10 ? `0${resolved}` : resolved}</b>
        <span className="delta">↑ 94% within SLA</span>
      </article>
    </section>
  );
}
