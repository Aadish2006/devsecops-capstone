import React from 'react';

export default function Metrics({ stats }) {
  const total = stats.total || 0;
  const open = stats.open || 0;
  const inProgress = stats.inProgress || 0;
  const resolved = stats.resolved || 0;

  return (
    <section className="metrics">
      <article className="card metric">
        <div className="metric-icon">▦</div>
        <small>Total Incidents</small>
        <b>{total < 10 ? `0${total}` : total}</b>
        <span className="delta">↑ 12% this week</span>
      </article>

      <article className="card metric">
        <div className="metric-icon">◌</div>
        <small>Open Tickets</small>
        <b>{open < 10 ? `0${open}` : open}</b>
        <span className="delta">↓ 3 since yesterday</span>
      </article>

      <article className="card metric">
        <div className="metric-icon">◷</div>
        <small>In Progress</small>
        <b>{inProgress < 10 ? `0${inProgress}` : inProgress}</b>
        <span className="delta">↑ 2 need review</span>
      </article>

      <article className="card metric">
        <div className="metric-icon">✓</div>
        <small>Resolved</small>
        <b>{resolved < 10 ? `0${resolved}` : resolved}</b>
        <span className="delta">↑ 94% within SLA</span>
      </article>
    </section>
  );
}
