import React from 'react'
import '../styles/HowItWorks.css'

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <div className="hiw-hero">
        <h1>How It Works for NGOs</h1>
        <p>Your journey from registration to global impact starts here</p>
      </div>

      <div className="hiw-content">
        <section className="hiw-step-section">
          <div className="step-container">
            <div className="step-number">01</div>
            <div className="step-text">
              <h2>Register & Verify</h2>
              <p>
                Sign up as an NGO and provide your registration documents. Our team will verify 
                your organization within 48-72 hours to ensure compliance and authenticity.
              </p>
            </div>
          </div>
        </section>

        <section className="hiw-step-section">
          <div className="step-container reverse">
            <div className="step-number">02</div>
            <div className="step-text">
              <h2>Create Campaigns</h2>
              <p>
                Once verified, you can launch multiple fundraising campaigns. Add compelling 
                titles, clear descriptions, goal amounts, and high-quality images to attract donors.
              </p>
            </div>
          </div>
        </section>

        <section className="hiw-step-section">
          <div className="step-container">
            <div className="step-number">03</div>
            <div className="step-text">
              <h2>Connect with Donors</h2>
              <p>
                Our platform promotes your campaigns to a global audience of compassionate donors. 
                Use our dashboard to track real-time donations and interact with your supporters.
              </p>
            </div>
          </div>
        </section>

        <section className="hiw-step-section">
          <div className="step-container reverse">
            <div className="step-number">04</div>
            <div className="step-text">
              <h2>Receive Funds & Report</h2>
              <p>
                Withdraw funds securely to implement your projects. Maintain transparency by 
                uploading progress reports and impact photos to keep your donors engaged.
              </p>
            </div>
          </div>
        </section>

        <section className="hiw-cta">
          <h2>Ready to expand your impact?</h2>
          <p>Join hundreds of verified NGOs making a difference through Good Health.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Register Now</button>
            <button className="btn btn-outline">Read NGO FAQ</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HowItWorks
