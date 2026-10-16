import React from 'react';

export default function Charts({ stats }) {
  const total = stats.total || 0;
  const open = stats.open || 0;
  const inProg = stats.inProgress || 0;
  const resolved = stats.resolved || 0;
  const investigating = Math.max(0, Math.floor(open / 2));
  const activeOpen = open - investigating;

  // Compute conic gradient stops dynamically
  const p1 = total > 0 ? (activeOpen / total) * 100 : 25;
  const p2 = total > 0 ? p1 + (investigating / total) * 100 : 45;
  const p3 = total > 0 ? p2 + (inProg / total) * 100 : 75;

  const donutBg = total > 0
    ? `conic-gradient(#f47761 0 ${p1}%, #ffcf6a ${p1}% ${p2}%, #8a77ea ${p2}% ${p3}%, #75d1aa ${p3}% 100%)`
    : 'conic-gradient(#f47761 0 25%, #ffcf6a 25% 45%, #8a77ea 45% 75%, #75d1aa 75% 100%)';

  return (
    <section className="charts">
      <article className="card chart-card">
        <div className="panel-heading">
          <div>
            <h2>Incident overview</h2>
            <p>Distribution by current status</p>
          </div>
          <button className="tiny-button">Live view ⌄</button>
        </div>
        <div className="donut-layout">
          <div className="donut" style={{ background: donutBg }}>
            <div className="donut-hole">
              <div>
                <b>{total}</b>
                <small>TOTAL</small>
              </div>
            </div>
          </div>
          <div className="legend">
            <div>
              <span><i style={{ background: '#f47761' }}></i>Open</span>
              <strong>{activeOpen}</strong>
            </div>
            <div>
              <span><i style={{ background: '#ffcf6a' }}></i>Investigating</span>
              <strong>{investigating}</strong>
            </div>
            <div>
              <span><i style={{ background: '#8a77ea' }}></i>In progress</span>
              <strong>{inProg}</strong>
            </div>
            <div>
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
            <p>Last 7 days performance</p>
          </div>
          <button className="tiny-button">97.8%</button>
        </div>
        <div className="sla">
          <div className="bar" style={{ height: '78%' }} data-day="Mon"></div>
          <div className="bar" style={{ height: '90%' }} data-day="Tue"></div>
          <div className="bar" style={{ height: '65%' }} data-day="Wed"></div>
          <div className="bar" style={{ height: '88%' }} data-day="Thu"></div>
          <div className="bar" style={{ height: '97%' }} data-day="Fri"></div>
          <div className="bar" style={{ height: '82%' }} data-day="Sat"></div>
          <div className="bar" style={{ height: '92%' }} data-day="Sun"></div>
        </div>
        <div className="target">
          <span>Target: 95%</span>
          <b>↑ 2.8% above target</b>
        </div>
      </article>
    </section>
  );
}
