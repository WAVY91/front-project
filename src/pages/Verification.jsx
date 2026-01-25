import React from 'react'
import '../styles/Verification.css'

const Verification = () => {
  return (
    <div className="verification-page">
      <div className="verification-hero">
        <h1>Verification Process</h1>
        <p>Maintaining the highest standards of trust and safety</p>
      </div>

      <div className="verification-content">
        <section className="v-intro">
          <h2>Why We Verify</h2>
          <p>
            To ensure donor confidence and platform integrity, every organization on Good Health 
            must undergo a rigorous verification process. This ensures that funds reach 
            legitimate causes and create the intended impact.
          </p>
        </section>

        <section className="v-steps">
          <div className="v-step">
            <div className="v-icon">📄</div>
            <div className="v-text">
              <h3>1. Documentation Review</h3>
              <p>We require CAC registration documents, NGO constitution, and proof of address. Our legal team reviews these for authenticity and validity.</p>
            </div>
          </div>

          <div className="v-step">
            <div className="v-icon">👤</div>
            <div className="v-text">
              <h3>2. Identity Verification</h3>
              <p>Key trustees and management personnel must undergo KYC (Know Your Customer) checks using government-issued identification.</p>
            </div>
          </div>

          <div className="v-step">
            <div className="v-icon">📍</div>
            <div className="v-text">
              <h3>3. Operational Check</h3>
              <p>We verify the physical existence of the NGO through office visits or video verification of their ongoing projects and operations.</p>
            </div>
          </div>

          <div className="v-step">
            <div className="v-icon">🏦</div>
            <div className="v-text">
              <h3>4. Financial Vetting</h3>
              <p>Organizations must provide corporate bank account details in the NGO's name. We do not disburse funds to personal accounts.</p>
            </div>
          </div>
        </section>

        <section className="v-checklist">
          <h2>Ready to get started?</h2>
          <p>Make sure you have these documents ready before you begin registration:</p>
          <ul>
            <li>Certificate of Incorporation (CAC)</li>
            <li>SCUML Certificate (where applicable)</li>
            <li>NGO Profile / Brochure</li>
            <li>Valid ID of a Trustee (NIN, Passport, or Driver's License)</li>
            <li>Proof of NGO Office Address</li>
          </ul>
        </section>

        <section className="v-timeline">
          <div className="timeline-info">
            <h3>Timeline</h3>
            <p>Once you submit all documents, our verification team typically completes the review within <strong>3-5 business days</strong>.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Verification
