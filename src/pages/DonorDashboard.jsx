import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import '../styles/Dashboard.css'

const DonorDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const donations = useSelector((state) => state.donations.donations)

  if (!user || user.role !== 'donor') {
    return (
      <div className="dashboard-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need to be logged in as a donor to access this dashboard.</p>
          <button onClick={() => navigate('/signin')} className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
  const campaignsSupported = new Set(donations.map((d) => d.campaignId)).size

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Donor Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button onClick={() => { dispatch(logout()); navigate('/'); }} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>Total Donated</h3>
          <p className="stat-value">₦{totalDonated.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <h3>Campaigns Supported</h3>
          <p className="stat-value">{campaignsSupported}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Total Donations</h3>
          <p className="stat-value">{donations.length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3>Impact Score</h3>
          <p className="stat-value">{Math.min(100, donations.length * 10)}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Donations</h2>
          <button onClick={() => navigate('/campaigns')} className="btn btn-secondary">
            Donate More
          </button>
        </div>

        {donations.length > 0 ? (
          <div className="donations-list">
            <div className="donations-table-header">
              <div>Campaign</div>
              <div>Organization</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
            </div>
            {donations.map((donation) => (
              <div key={donation.id} className="donation-item">
                <div className="donation-campaign">{donation.campaignTitle}</div>
                <div className="donation-ngo">{donation.ngoName}</div>
                <div className="donation-amount">₦{donation.amount.toLocaleString()}</div>
                <div className="donation-date">
                  {new Date(donation.timestamp).toLocaleDateString()}
                </div>
                <div className="donation-status">
                  <span className="status-badge completed">{donation.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't made any donations yet.</p>
            <button onClick={() => navigate('/campaigns')} className="btn btn-primary">
              Start Donating
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Impact Report</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <h3>Average Donation</h3>
            <p className="impact-value">
              ₦{donations.length > 0 ? Math.round(totalDonated / donations.length).toLocaleString() : 0}
            </p>
          </div>
          <div className="impact-card">
            <h3>Largest Donation</h3>
            <p className="impact-value">
              ₦{donations.length > 0 ? Math.max(...donations.map((d) => d.amount)).toLocaleString() : 0}
            </p>
          </div>
          <div className="impact-card">
            <h3>Organizations Helped</h3>
            <p className="impact-value">
              {new Set(donations.map((d) => d.ngoName)).size}
            </p>
          </div>
          <div className="impact-card">
            <h3>Donor Tier</h3>
            <p className="impact-value">
              {totalDonated >= 50000 ? 'Gold' : totalDonated >= 20000 ? 'Silver' : totalDonated > 0 ? 'Bronze' : 'Newbie'}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Tax Certificate</h2>
        <div className="tax-info">
          <p>All your donations are eligible for tax deduction under Section 80G of the Income Tax Act.</p>
          <button className="btn btn-primary">
            Download Tax Certificate
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
