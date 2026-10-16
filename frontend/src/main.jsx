import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Charts from './components/Charts';
import TicketTable from './components/TicketTable';
import RightRail from './components/RightRail';
import Modal from './components/Modal';

const API = '/api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API}/tickets`),
        fetch(`${API}/tickets/stats`),
      ]);
      if (!ticketsRes.ok || !statsRes.ok) throw new Error('Cloud backend services unreachable');
      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();
      setTickets(ticketsData);
      setStats({
        total: statsData.total || 0,
        open: statsData.open !== undefined ? statsData.open : statsData.todo || 0,
        inProgress: statsData.inProgress || 0,
        resolved: statsData.resolved !== undefined ? statsData.resolved : statsData.done || 0,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleTickets = tickets
    .filter((t) => {
      const s = (t.status || '').toUpperCase();
      if (filter === 'open') return s === 'OPEN' || s === 'TODO';
      if (filter === 'progress') return s === 'IN_PROGRESS';
      if (filter === 'resolved') return s === 'RESOLVED' || s === 'DONE';
      return true;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.assignee && t.assignee.toLowerCase().includes(q)) ||
        (t.priority && t.priority.toLowerCase().includes(q))
      );
    });

  const handleAdvanceStatus = async (ticket) => {
    let nextStatus = 'OPEN';
    const current = (ticket.status || '').toUpperCase();
    if (current === 'OPEN' || current === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (current === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else nextStatus = 'OPEN';

    try {
      await fetch(`${API}/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticket, status: nextStatus }),
      });
      loadData();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await fetch(`${API}/tickets/${ticketId}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error('Failed to delete ticket', e);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await fetch(`${API}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: f.get('title'),
          description: f.get('description'),
          priority: f.get('priority'),
          assignee: f.get('assignee'),
          status: 'OPEN',
        }),
      });
      form.reset();
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleEscalate = () => {
    setFilter('open');
    setSearchQuery('critical');
  };

  const handleViewReports = () => {
    alert(`OpsDesk Executive Summary:\n• Total Incidents: ${stats.total}\n• Open Tickets: ${stats.open}\n• In Progress: ${stats.inProgress}\n• SLA Resolution Rate: 97.8%`);
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <main className="main">
        <Topbar
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Hero onOpenModal={() => setShowModal(true)} />

        {error && (
          <div style={{
            background: '#fff0ec',
            color: '#c24a3c',
            padding: '12px 18px',
            borderRadius: '14px',
            marginBottom: '20px',
            fontWeight: 600,
            fontSize: '12.5px'
          }}>
            ⚠ {error}. Ensure the FastAPI backend is running on port 8000.
          </div>
        )}

        <div className="dashboard-layout">
          <div>
            <Metrics stats={stats} />
            <Charts stats={stats} />
            <TicketTable
              tickets={visibleTickets}
              filter={filter}
              onFilterChange={setFilter}
              onAdvanceStatus={handleAdvanceStatus}
              onDeleteTicket={handleDeleteTicket}
              loading={loading}
            />
          </div>

          <RightRail
            onOpenModal={() => setShowModal(true)}
            onEscalate={handleEscalate}
            onViewReports={handleViewReports}
          />
        </div>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
