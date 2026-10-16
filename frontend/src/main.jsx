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
import TicketDetailModal from './components/TicketDetailModal';
import ReportsModal from './components/ReportsModal';
import AddServiceModal from './components/AddServiceModal';
import NotificationsModal from './components/NotificationsModal';
import ProfileModal from './components/ProfileModal';
import InfrastructureModal from './components/InfrastructureModal';
import SystemAuditModal from './components/SystemAuditModal';

const API = '/api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  // Modals & Drawers state
  const [showModal, setShowModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showInfra, setShowInfra] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [inspectTicket, setInspectTicket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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
      const p = (t.priority || '').toUpperCase();
      if (filter === 'open') return s === 'OPEN' || s === 'TODO';
      if (filter === 'progress') return s === 'IN_PROGRESS';
      if (filter === 'resolved') return s === 'RESOLVED' || s === 'DONE';
      if (filter === 'outages') return (s === 'OPEN' || s === 'IN_PROGRESS') && (p === 'CRITICAL' || p === 'HIGH');
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
      showToast(`Ticket #${ticket.id} advanced to ${nextStatus.replace('_', ' ')}.`);
      loadData();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await fetch(`${API}/tickets/${ticketId}`, { method: 'DELETE' });
      showToast(`Ticket #${ticketId} deleted successfully.`);
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
      showToast('New incident ticket logged successfully.');
      loadData();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleSelectNav = (navId) => {
    setActiveNav(navId);
    if (navId === 'dashboard') {
      setFilter('all');
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Dashboard command overview');
    } else if (navId === 'outages') {
      setFilter('outages');
      setSearchQuery('');
      showToast('Filtered to active outages (P1 & P2).');
      document.querySelector('.tickets')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'incidents') {
      setFilter('all');
      setSearchQuery('');
      showToast('Viewing all incident tickets.');
      document.querySelector('.tickets')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'slas') {
      setShowReports(true);
    } else if (navId === 'infra') {
      setShowInfra(true);
    } else if (navId === 'audit') {
      setShowAudit(true);
    }
  };

  const handleSelectIssue = (keyword) => {
    const q = keyword.toLowerCase();
    const match = tickets.find((t) =>
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.priority && t.priority.toLowerCase().includes(q))
    );
    if (match) {
      setInspectTicket(match);
      showToast(`Inspecting incident #${match.id}: ${match.title}`);
    } else {
      setSearchQuery(keyword);
      setFilter('all');
      document.querySelector('.tickets')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterSelect = (f) => {
    setFilter(f);
    setSearchQuery('');
    showToast(`Filter applied: ${f.toUpperCase()}`);
    document.querySelector('.tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEscalate = () => {
    const criticalTicket = tickets.find((t) => (t.priority || '').toUpperCase() === 'CRITICAL');
    setFilter('open');
    setSearchQuery('critical');
    if (criticalTicket) {
      setInspectTicket(criticalTicket);
    }
    showToast('🚨 P1 Escalation: Notified on-call SRE & opened critical incident ticket.');
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onOpenProfile={() => setShowProfile(true)}
      />

      <main className="main">
        <Topbar
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenProfile={() => setShowProfile(true)}
        />

        <Hero onOpenModal={() => setShowModal(true)} />

        {toastMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #7e6beb, #6852d4)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '14px',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '12.5px',
            boxShadow: '0 8px 20px rgba(104,82,212,.22)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} style={{ background: 'transparent', color: 'white', fontWeight: 900 }}>✕</button>
          </div>
        )}

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
            ⚠ {error}. Ensure FastAPI backend is running on port 8000.
          </div>
        )}

        <div className="dashboard-layout">
          <div>
            <Metrics
              stats={stats}
              currentFilter={filter}
              onSelectFilter={handleFilterSelect}
            />

            <Charts
              stats={stats}
              onSelectFilter={handleFilterSelect}
              onOpenReports={() => setShowReports(true)}
            />

            <TicketTable
              tickets={visibleTickets}
              filter={filter}
              onFilterChange={(f) => setFilter(f)}
              onAdvanceStatus={handleAdvanceStatus}
              onDeleteTicket={handleDeleteTicket}
              onInspectTicket={(t) => setInspectTicket(t)}
              loading={loading}
            />
          </div>

          <RightRail
            onOpenModal={() => setShowModal(true)}
            onEscalate={handleEscalate}
            onViewReports={() => setShowReports(true)}
            onOpenAddService={() => setShowAddService(true)}
            onSearchOutage={handleSelectIssue}
            onOpenAudit={() => setShowAudit(true)}
          />
        </div>
      </main>

      {/* Interactive Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTicket}
      />

      <TicketDetailModal
        ticket={inspectTicket}
        onClose={() => setInspectTicket(null)}
        onAdvanceStatus={handleAdvanceStatus}
        onDeleteTicket={handleDeleteTicket}
      />

      <ReportsModal
        isOpen={showReports}
        onClose={() => setShowReports(false)}
        stats={stats}
      />

      <AddServiceModal
        isOpen={showAddService}
        onClose={() => setShowAddService(false)}
        onServiceAdded={(name) => showToast(`Service '${name}' registered with Prometheus scraper.`)}
      />

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectAlert={(q) => {
          setShowNotifications(false);
          if (q === 'audit') setShowAudit(true);
          else handleSelectIssue(q);
        }}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <InfrastructureModal
        isOpen={showInfra}
        onClose={() => setShowInfra(false)}
        onOpenAddService={() => setShowAddService(true)}
      />

      <SystemAuditModal
        isOpen={showAudit}
        onClose={() => setShowAudit(false)}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
