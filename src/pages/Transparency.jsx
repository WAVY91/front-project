import React from 'react'
import '../styles/Transparency.css'

const Transparency = () => {
  return (
    <div className="transparency-page">
      <div className="transparency-hero">
        <h1>Transparency Reports</h1>
        <p>Our commitment to accountability and trust in charitable giving</p>
      </div>

      <div className="transparency-content">
        <section className="transparency-section">
          <h2>Our Financial Commitment</h2>
          <p>
            At Good Health, we believe that transparency is the foundation of trust. We are committed 
            to showing exactly how funds are collected, processed, and distributed to verified NGOs.
          </p>
          <div className="stat-grid">
            <div className="stat-item">
              <h3>100%</h3>
              <p>Direct Distribution to NGOs</p>
            </div>
            <div className="stat-item">
              <h3>Real-time</h3>
              <p>Donation Tracking</p>
            </div>
            <div className="stat-item">
              <h3>Verified</h3>
              <p>Impact Documentation</p>
            </div>
          </div>
        </section>

        <section className="transparency-section">
          <h2>How We Ensure Accountability</h2>
          <div className="accountability-list">
            <div className="accountability-item">
              <h3>Rigorous NGO Vetting</h3>
              <p>
                Every NGO on our platform undergoes a multi-stage verification process, 
                including legal registration checks, track record analysis, and physical verification.
              </p>
            </div>
            <div className="accountability-item">
              <h3>Project Milestones</h3>
              <p>
                Funds are released based on project milestones. NGOs must provide evidence of 
                progress before subsequent disbursements are made.
              </p>
            </div>
            <div className="accountability-item">
              <h3>Direct Donor Updates</h3>
              <p>
                Donors receive automated updates when their contributions are utilized, 
                complete with photos, videos, and impact metrics from the field.
              </p>
            </div>
          </div>
        </section>

        <section className="transparency-section">
          <h2>Annual Impact Reports</h2>
          <p>
            We publish detailed annual reports that break down our collective impact, 
            operational costs, and future goals. Our goal is to be the most transparent 
            philanthropic platform in the world.
          </p>
          <div className="report-download">
            <button className="btn btn-primary">Download 2024 Impact Report (PDF)</button>
            <button className="btn btn-outline" style={{ marginLeft: '10px' }}>View Financial Audit</button>
          </div>
        </section>

        <section className="transparency-section trust-seal">
          <div className="seal-content">
            <h2>Trust is Our Currency</h2>
            <p>
              Join thousands of donors who trust Good Health to manage their charitable 
              contributions with the highest standards of integrity.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Transparency
