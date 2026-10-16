import React, { useState } from 'react';

export default function AddServiceModal({ isOpen, onClose, onServiceAdded }) {
  const [serviceName, setServiceName] = useState('');
  const [namespace, setNamespace] = useState('production');
  const [healthPath, setHealthPath] = useState('/health');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onServiceAdded(serviceName);
      setSubmitted(false);
      setServiceName('');
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Service Discovery</p>
            <h2>Register Monitored Service</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>×</button>
        </div>

        {submitted ? (
          <div style={{ padding: '30px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>✓</span>
            <b style={{ fontSize: '16px', color: '#2f7c50' }}>Service Registered &amp; Verified!</b>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
              Prometheus scrape target and liveness probes configured for {serviceName}.
            </p>
          </div>
        ) : (
          <>
            <label>
              Microservice Name
              <input
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. payment-gateway, auth-service, inventory-api"
              />
            </label>

            <div className="form-row">
              <label>
                Kubernetes Namespace
                <select value={namespace} onChange={(e) => setNamespace(e.target.value)}>
                  <option value="production">production</option>
                  <option value="staging">staging</option>
                  <option value="taskboard">taskboard</option>
                  <option value="monitoring">monitoring</option>
                </select>
              </label>

              <label>
                Health Check Endpoint
                <input
                  required
                  value={healthPath}
                  onChange={(e) => setHealthPath(e.target.value)}
                  placeholder="/health"
                />
              </label>
            </div>

            <button type="submit" className="submit-btn">
              ＋ Register &amp; Start Scraping
            </button>
          </>
        )}
      </form>
    </div>
  );
}
