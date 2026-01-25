import React from 'react'
import '../styles/Support.css'

const Support = () => {
  return (
    <div className="support-page">
      <div className="support-hero">
        <h1>NGO Support Center</h1>
        <p>We're here to help you maximize your fundraising potential</p>
      </div>

      <div className="support-content">
        <div className="support-grid">
          <div className="support-card">
            <div className="icon">📚</div>
            <h3>Resource Library</h3>
            <p>Access templates, guides, and best practices for creating successful campaigns.</p>
            <button className="btn-text">Browse Resources →</button>
          </div>

          <div className="support-card">
            <div className="icon">🛠️</div>
            <h3>Technical Help</h3>
            <p>Troubleshooting dashboard issues, payment integration, or account settings.</p>
            <button className="btn-text">Open Ticket →</button>
          </div>

          <div className="support-card">
            <div className="icon">🎨</div>
            <h3>Storytelling Tips</h3>
            <p>Learn how to capture compelling photos and write stories that move donors.</p>
            <button className="btn-text">Learn More →</button>
          </div>

          <div className="support-card">
            <div className="icon">📊</div>
            <h3>Analytics Support</h3>
            <p>Understand your campaign data to optimize performance and donor retention.</p>
            <button className="btn-text">View Guide →</button>
          </div>
        </div>

        <section className="contact-support">
          <h2>Direct Support</h2>
          <p>Can't find what you're looking for? Our NGO success team is available 24/7.</p>
          <div className="contact-methods">
            <div className="method">
              <strong>Email:</strong> ngo-support@goodhealth.org
            </div>
            <div className="method">
              <strong>Live Chat:</strong> Available in your NGO Dashboard
            </div>
            <div className="method">
              <strong>Phone:</strong> +234 800-NGO-HELP
            </div>
          </div>
        </section>

        <section className="faq-teaser">
          <h2>Common Questions</h2>
          <div className="faq-simple">
            <details>
              <summary>How long does verification take?</summary>
              <p>Typically 48-72 business hours after all documents are uploaded.</p>
            </details>
            <details>
              <summary>What are the platform fees?</summary>
              <p>Good Health is 100% free for NGOs; we rely on optional donor tips to operate.</p>
            </details>
            <details>
              <summary>When can I withdraw funds?</summary>
              <p>You can request a withdrawal as soon as your campaign reaches 10% of its goal.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Support
