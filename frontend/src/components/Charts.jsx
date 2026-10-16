import React, { useState } from 'react';

export default function Charts({ stats, onSelectFilter, onOpenReports }) {
  const [timeframe, setTimeframe] = useState('Live view');
  const [selectedDay, setSelectedDay] = useState(null);

  const total = stats.total || 0;
  const open = stats.open || 0;
  const inProg = stats.inProgress || 0;
  const resolved = stats.resolved || 0;
  const investigating = Math.max(0, Math.floor(open / 2));
  const activeOpen = open - investigating;

  const p1 = total > 0 ? (activeOpen / total) * 100 : 25;
  const p2 = total > 0 ? p1 + (investigating / total) * 100 : 45;
  const p3 = total > 0 ? p2 + (inProg / total) * 100 : 75;

  const donutBg = total > 0
    ? `conic-gradient(#f47761 0 ${p1}%, #ffcf6a ${p1}% ${p2}%, #8a77ea ${p2}% ${p3}%, #75d1aa ${p3}% 100%)`
    : 'conic-gradient(#f47761 0 25%, #ffcf6a 25% 45%, #8a77ea 45% 75%, #75d1aa 75% 100%)';

  const days = [
    { day: 'Mon', rate: '98.2%', height: '78%' },
    { day: 'Tue', rate: '99.0%', height: '90%' },
    { day: 'Wed', rate: '96.5%', height: '65%' },
    { day: 'Thu', rate: '98.8%', height: '88%' },
    { day: 'Fri', rate: '99.7%', height: '97%' },
    { day: 'Sat', rate: '98.2%', height: '82%' },
    { day: 'Sun', rate: '99.2%', height: '92%' },
  ];

  return (
    <section className="charts">
      <article className="card chart-card">
        <div className="panel-heading">
          <div>
            <h2>Incident overview</h2>
            <p>Distribution by current status</p>
          </div>
          <button
            className="tiny-button"
            onClick={() => setTimeframe(timeframe === 'Live view' ? 'Past 7 Days' : 'Live view')}
            title="Toggle time scope"
          >
            {timeframe} ⌄
          </button>
        </div>

        <div className="donut-layout">
          <div
            className="donut"
            style={{ background: donutBg, cursor: 'pointer' }}
            onClick={() => onSelectFilter('all')}
            title="Click to view all tickets"
          >
            <div className="donut-hole">
              <div>
                <b>{total}</b>
                <small>TOTAL</small>
              </div>
            </div>
          </div>

          <div className="legend">
            <div
              style={{ cursor: 'pointer', padding: '3px 0' }}
              onClick={() => onSelectFilter('open')}
              title="Filter by Open tickets"
            >
              <span><i style={{ background: '#f47761' }}></i>Open</span>
              <strong>{activeOpen}</strong>
            </div>
            <div
              style={{ cursor: 'pointer', padding: '3px 0' }}
              onClick={() => onSelectFilter('open')}
              title="Filter by Investigating tickets"
            >
              <span><i style={{ background: '#ffcf6a' }}></i>Investigating</span>
              <strong>{investigating}</strong>
            </div>
            <div
              style={{ cursor: 'pointer', padding: '3px 0' }}
              onClick={() => onSelectFilter('progress')}
              title="Filter by In Progress"
            >
              <span><i style={{ background: '#8a77ea' }}></i>In progress</span>
              <strong>{inProg}</strong>
            </div>
            <div
              style={{ cursor: 'pointer', padding: '3px 0' }}
              onClick={() => onSelectFilter('resolved')}
              title="Filter by Resolved"
            >
              <span><i style={{ background: '#75d1aa' }}></i>Resolved</span>
              <strong>{resolved}</strong>
            </div>
          </div>
        </div>
      </article>

      <article className="card chart-card">
        <div className="panel-heading">
          <div>
            <h2>SLA compliance</h2>
            <p>{selectedDay ? `${selectedDay.day} SLA: ${selectedDay.rate}` : 'Last 7 days performance'}</p>
          </div>
          <button
            className="tiny-button"
            onClick={onOpenReports}
            title="Open Full SRE &amp; SLA Report"
          >
            97.8% ↗
          </button>
        </div>

        <div className="sla">
          {days.map((d) => (
            <div
              key={d.day}
              className="bar"
              style={{
                height: d.height,
                cursor: 'pointer',
                opacity: selectedDay && selectedDay.day !== d.day ? 0.6 : 1,
                transform: selectedDay && selectedDay.day === d.day ? 'scaleY(1.04)' : 'none',
              }}
              data-day={d.day}
              onClick={() => setSelectedDay(selectedDay?.day === d.day ? null : d)}
              title={`${d.day}: ${d.rate} SLA compliance (Click to highlight)`}
            />
          ))}
        </div>

        <div className="target">
          <span>Target: 95%</span>
          <b style={{ cursor: 'pointer' }} onClick={onOpenReports}>↑ 2.8% above target</b>
        </div>
      </article>
    </section>
  );
}
