import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = '/api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [a, b] = await Promise.all([
        fetch(`${API}/tickets`),
        fetch(`${API}/tickets/stats`)
      ]);
      if (!a.ok || !b.ok) throw Error('Backend service unavailable');
      const ticketsData = await a.json();
      const statsData = await b.json();
      setTickets(ticketsData);
      setStats({
        total: statsData.total || 0,
        open: statsData.open !== undefined ? statsData.open : statsData.todo || 0,
        inProgress: statsData.inProgress || 0,
        resolved: statsData.resolved !== undefined ? statsData.resolved : statsData.done || 0
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = filter === 'ALL'
    ? tickets
    : tickets.filter(t => {
        const s = t.status.toUpperCase();
        if (filter === 'OPEN') return s === 'OPEN' || s === 'TODO';
        if (filter === 'IN_PROGRESS') return s === 'IN_PROGRESS';
        if (filter === 'RESOLVED') return s === 'RESOLVED' || s === 'DONE';
        return s === filter;
      });

  const advanceStatus = async (t) => {
    let nextStatus = 'OPEN';
    const current = t.status.toUpperCase();
    if (current === 'OPEN' || current === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (current === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else nextStatus = 'OPEN';

    await fetch(`${API}/tickets/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, status: nextStatus })
    });
    load();
  };

  const del = async (id) => {
    await fetch(`${API}/tickets/${id}`, { method: 'DELETE' });
    load();
  };

  const create = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    await fetch(`${API}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: f.get('title'),
        description: f.get('description'),
        priority: f.get('priority'),
        assignee: f.get('assignee'),
        status: 'OPEN'
      })
    });
    form.reset();
    setShowForm(false);
    load();
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">O</span>
          <div>
            <b>OpsDesk</b>
            <small>Cloud & IT Helpdesk</small>
          </div>
        </div>
        <nav>
          <a className="active">▦ <span>Incident Desk</span></a>
          <a>⚡ <span>Active Outages</span></a>
          <a>🛡️ <span>SLAs & Alerts</span></a>
          <a>◌ <span>System Audit</span></a>
        </nav>
        <div className="side-bottom">
          <div className="upgrade">
            <strong>Zero-Downtime SRE</strong>
            <p>Monitored via Prometheus, Grafana & Kubernetes HPA.</p>
          </div>
          <div className="profile">
            <div className="avatar">AS</div>
            <div>
              <b>Aadish</b>
              <small>DevOps Engineer</small>
            </div>
            <span>⋮</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="eyebrow">SERVICE DESK / INCIDENT MANAGEMENT</p>
            <h1>DevOps Incident Center — Good morning, Aadish 👋</h1>
            <p className="muted">Real-time cloud infrastructure tickets, SLA tracking, and system health.</p>
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>＋ Log Incident</button>
        </header>

        {error && (
          <div className="alert">
            ⚠ {error}. Ensure FastAPI backend and PostgreSQL are running, then refresh.
          </div>
        )}

        <section className="stats">
          <Stat label="Total Incidents" value={stats.total} icon="▦" />
          <Stat label="Open Tickets" value={stats.open} icon="○" />
          <Stat label="In Progress" value={stats.inProgress} icon="◔" />
          <Stat label="Resolved & Closed" value={stats.resolved} icon="✓" />
        </section>

        <section className="content-grid">
          <div className="panel tasks-panel">
            <div className="panel-head">
              <div>
                <h2>Incident Tickets</h2>
                <p className="muted">Track customer issues, cloud alerts, and service outages.</p>
              </div>
              <div className="filters">
                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(x => (
                  <button
                    key={x}
                    className={filter === x ? 'selected' : ''}
                    onClick={() => setFilter(x)}
                  >
                    {x === 'ALL' ? 'All Tickets' : x.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="empty">Loading tickets…</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Incident Ticket</th>
                      <th>Assigned Engineer</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(t => (
                      <tr key={t.id}>
                        <td>
                          <div className="task-title">
                            <span className={`dot ${(t.status || 'open').toLowerCase()}`}></span>
                            <div>
                              <b>{t.title}</b>
                              <small>{t.description || 'No description provided'}</small>
                            </div>
                          </div>
                        </td>
                        <td>{t.assignee}</td>
                        <td>
                          <span className={`priority ${(t.priority || 'medium').toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${(t.status || 'open').toLowerCase()}`}>
                            {(t.status || 'OPEN').replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <button
                            className="icon-btn"
                            onClick={() => advanceStatus(t)}
                            title="Advance Status"
                          >
                            ↻
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => del(t.id)}
                            title="Delete Ticket"
                            style={{ marginLeft: '6px', color: '#c75a5a' }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visible.length && <div className="empty">No tickets match this filter.</div>}
              </div>
            )}
          </div>

          <aside className="panel activity">
            <div className="panel-head">
              <div>
                <h2>DevOps Incident Log</h2>
                <p className="muted">Latest workspace & infrastructure events.</p>
              </div>
            </div>
            <Activity icon="✓" text="[P1 Resolved] Database latency spike mitigated" time="12 min ago" />
            <Activity icon="◔" text="[In Progress] Ingress SSL cert renewal" time="35 min ago" />
            <Activity icon="＋" text="[New Ticket] Pod memory pressure on EKS worker" time="1 hr ago" />
            <Activity icon="↗" text="[CI/CD] Trivy container security scan cleared" time="2 hrs ago" />
            <div className="pipeline">
              <span>CI</span>
              <i></i>
              <span>Build</span>
              <i></i>
              <span>Trivy Scan</span>
              <i></i>
              <span>GHCR</span>
              <i></i>
              <span>K8s Deploy</span>
            </div>
          </aside>
        </section>

        {showForm && (
          <div className="modal-backdrop">
            <form className="modal" onSubmit={create}>
              <div className="modal-head">
                <div>
                  <p className="eyebrow">LOG NEW INCIDENT</p>
                  <h2>Report an Incident Ticket</h2>
                </div>
                <button type="button" className="close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <label>
                Incident Subject / Title
                <input
                  name="title"
                  required
                  placeholder="e.g. EKS Pod memory pressure in ap-south-1"
                />
              </label>
              <label>
                Technical Description & Logs
                <textarea
                  name="description"
                  placeholder="Describe observed behavior, impacted services, and error codes..."
                />
              </label>
              <div className="form-row">
                <label>
                  Urgency / Priority
                  <select name="priority" defaultValue="HIGH">
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </label>
                <label>
                  Assigned Engineer
                  <input name="assignee" defaultValue="Aadish (DevOps Lead)" />
                </label>
              </div>
              <button className="primary full">Submit Incident Ticket</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>Updated live</span>
      </div>
    </div>
  );
}

function Activity({ icon, text, time }) {
  return (
    <div className="activity-row">
      <span className="activity-icon">{icon}</span>
      <div>
        <b>{text}</b>
        <small>{time}</small>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
