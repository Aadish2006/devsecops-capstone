import React from 'react';

export default function RightRail({ onOpenModal, onEscalate, onViewReports }) {
  return (
    <aside className="right-rail">
      <section className="card rail-card">
        <h2>
          Active outages <span className="live">● LIVE</span>
        </h2>
        <p>Services needing attention now</p>
        <div className="outage">
          <b>API gateway latency</b>
          <small>Critical · 14 min ago</small>
        </div>
        <div className="outage" style={{ background: '#fff8df' }}>
          <b>Worker node capacity</b>
          <small style={{ color: '#ad8a2a' }}>Investigating · 32 min ago</small>
        </div>
      </section>

      <section className="card rail-card">
        <h2>Recent activity</h2>
        <p>A pulse of your workspace</p>
        <div className="activity">
          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#dff7ed', color: '#2f7c50' }}>✓</div>
            <div>
              <b>Database latency spike mitigated</b>
              <small>12 min ago · Priya Nair</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#ebe6ff', color: '#6852d4' }}>◷</div>
            <div>
              <b>SSL certificate renewal started</b>
              <small>35 min ago · Automation</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#ffe5df', color: '#c85a3c' }}>＋</div>
            <div>
              <b>Memory pressure alert created</b>
              <small>1 hr ago · Prometheus</small>
            </div>
          </div>
        </div>
      </section>

      <section className="card rail-card">
        <h2>Quick actions</h2>
        <p>Common incident workflows</p>
        <div className="quick-actions">
          <button onClick={onOpenModal}>＋ New ticket</button>
          <button onClick={onViewReports}>☷ View reports</button>
          <button onClick={() => alert('Infrastructure microservice discovery active.')}>⌁ Add service</button>
          <button onClick={onEscalate}>◌ Escalate</button>
        </div>
        <div className="pipeline-status">
          <span>CI</span>
          <i></i>
          <span>Build</span>
          <i></i>
          <span>Trivy</span>
          <i></i>
          <span>GHCR</span>
          <i></i>
          <span>K8s</span>
        </div>
      </section>
    </aside>
  );
}
