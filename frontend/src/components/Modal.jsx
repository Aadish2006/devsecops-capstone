import React from 'react';

export default function Modal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Log incident</p>
            <h2>Report an Incident Ticket</h2>
          </div>
          <button type="button" className="close" onClick={onClose}>
            ×
          </button>
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
          Technical Description &amp; Error Logs
          <textarea
            name="description"
            rows="3"
            placeholder="Describe observed behavior, impacted microservices, and error traces..."
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
            <input name="assignee" defaultValue="Aadish Sharma" />
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit Incident Ticket
        </button>
      </form>
    </div>
  );
}
