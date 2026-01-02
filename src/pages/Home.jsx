import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CampaignCard from '../components/CampaignCard'
import Counter from '../components/Counter'
import '../styles/Home.css'

const API_URL = 'https://back-project-7y6z.onrender.com'

const Home = () => {
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  const user = useSelector((state) => state.auth.user)
  const [totalDonors, setTotalDonors] = useState(0)

  useEffect(() => {
    const fetchTotalDonors = async () => {
      try {
        const response = await fetch(`${API_URL}/donor/all`)
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setTotalDonors(data.data.length)
        }
      } catch {
        setTotalDonors(100)
      }
    }

    fetchTotalDonors()
  }, [])

  const totalFundsRaised = campaigns.reduce((sum, campaign) => sum + (campaign.raisedAmount || 0), 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Make a Difference Today</h1>
          <p>Support verified non-profit organizations with direct donations to healthcare, education, food security, housing, electricity, and humanitarian relief campaigns that create real impact in communities worldwide.</p>
          {!user ? (
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/signin" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/campaigns" className="btn btn-primary">
                View Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Verified NGOs</h3>
            <p>All organizations are thoroughly verified and transparent</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Secure Payments</h3>
            <p>Your donations are processed securely with full protection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Transparency Reports</h3>
            <p>Track how your donations are being used in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Community Impact</h3>
            <p>Join thousands making a positive impact globally</p>
          </div>
        </div>
      </section>

      <section className="campaigns-preview">
        <h2>Featured Campaigns</h2>
        <div className="campaigns-grid">
          {campaigns.slice(0, 6).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        <div className="view-all">
          <Link to="/campaigns" className="btn btn-primary">
            View All Campaigns
          </Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <h3>
            ₦<Counter target={totalFundsRaised || 10000000} duration={2500} suffix="+" format="M" />
          </h3>
          <p>Total Funds Raised</p>
        </div>
        <div className="stat-item">
          <h3>
            <Counter target={activeCampaigns || campaigns.length || 0} duration={2000} suffix="+" />
          </h3>
          <p>Active Campaigns</p>
        </div>
        <div className="stat-item">
          <h3>
            <Counter target={totalDonors || 100} duration={2000} suffix="+" />
          </h3>
          <p>Donors Worldwide</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Customer Support</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Make an Impact?</h2>
        <p>Join our community of donors and start helping today</p>
        {!user ? (
          <Link to="/signup" className="btn btn-primary large">
            Sign Up Now
          </Link>
        ) : (
          <Link to="/campaigns" className="btn btn-primary large">
            Explore Campaigns
          </Link>
        )}
      </section>
    </div>
  )
}

export default Home
