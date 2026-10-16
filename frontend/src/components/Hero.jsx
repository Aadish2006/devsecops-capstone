import React from 'react';

export default function Hero({ onOpenModal }) {
  return (
    <section className="hero">
      <p className="eyebrow">Service desk / incident management</p>
      <h1>
        Good morning, Aadish!<br />
        Your systems are looking bright.
      </h1>
      <p>Stay on top of every alert, ticket, and service health signal.</p>
      <button className="new-incident" onClick={onOpenModal}>
        ＋ Log incident
      </button>
      <div className="cloud">
        <i>☼</i>
      </div>
    </section>
  );
}
