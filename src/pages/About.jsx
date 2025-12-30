import React from 'react'
import '../styles/About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Good Health</h1>
        <p>Making a difference through transparent and verified charitable giving</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Good Health is a digital platform dedicated to connecting compassionate donors with verified NGOs
            and meaningful causes. We believe in transparency, accountability, and the power of collective
            action to create lasting social impact.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            To build a world where charitable giving is transparent, accessible, and impactful. We envision
            a future where donors can confidently support causes they believe in, knowing exactly how their
            contributions are making a difference.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Good Health?</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number">1</div>
              <div className="feature-content">
                <h3>Verified NGOs</h3>
                <p>All organizations on our platform are thoroughly verified and screened</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">2</div>
              <div className="feature-content">
                <h3>Transparent Tracking</h3>
                <p>Track your donations in real-time and see the impact being created</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">3</div>
              <div className="feature-content">
                <h3>Secure Payments</h3>
                <p>All transactions are secure, encrypted, and comply with industry standards</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">4</div>
              <div className="feature-content">
                <h3>Impact Reports</h3>
                <p>Receive detailed reports on how your donations are making a difference</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Good Health is built by a passionate team of developers, designers, and social impact enthusiasts
            committed to making charitable giving simple and transparent.
          </p>
        </section>

        <section className="about-section contact-cta">
          <h2>Questions? Get in Touch</h2>
          <p>We'd love to hear from you. Contact us anytime.</p>
          <a href="timetomisin@gmail.com" className="btn btn-primary">
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}

export default About
