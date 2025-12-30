import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentDonation } from '../store/slices/donationSlice'
import '../styles/CampaignDetail.css'

const CampaignDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  
  // Try to find campaign by _id (MongoDB) or id (numeric)
  const campaign = campaigns.find((c) => 
    c._id === id || c.id === parseInt(id)
  )
  const [showDonationModal, setShowDonationModal] = useState(false)

  if (!campaign) {
    return (
      <div className="campaign-detail-page">
        <div className="not-found">
          <h2>Campaign not found</h2>
          <Link to="/campaigns" className="btn btn-primary">
            Back to Campaigns
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = (campaign.raisedAmount / campaign.goalAmount) * 100

  const handleDonate = () => {
    if (!user) {
      navigate('/signin')
      return
    }
    setShowDonationModal(true)
  }

  return (
    <div className="campaign-detail-page">
      <Link to="/campaigns" className="back-link">← Back to Campaigns</Link>

      <div className="campaign-detail-container">
        <div className="campaign-detail-image">
          <img src={campaign.image} alt={campaign.title} />
          {campaign.verified && <div className="verified-badge">✓ Verified</div>}
        </div>

        <div className="campaign-detail-content">
          <div className="campaign-title-section">
            <h1>{campaign.title}</h1>
            <span className="campaign-category-badge">{campaign.category}</span>
          </div>

          <div className="ngo-info">
            <div className="ngo-avatar">
              {campaign.ngoName.charAt(0).toUpperCase()}
            </div>
            <div className="ngo-details">
              <h3>{campaign.ngoName}</h3>
              <p>{campaign.description}</p>
            </div>
          </div>

          <div className="funding-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="progress-percentage">{Math.round(progressPercentage)}%</p>
            <div className="funding-stats">
              <div className="stat">
                <span className="stat-value">₦{campaign.raisedAmount.toLocaleString()}</span>
                <span className="stat-label">Raised</span>
              </div>
              <div className="stat">
                <span className="stat-value">₦{campaign.goalAmount.toLocaleString()}</span>
                <span className="stat-label">Goal</span>
              </div>
              <div className="stat">
                <span className="stat-value">{campaign.totalDonorsCount || 0}</span>
                <span className="stat-label">Donors</span>
              </div>
              <div className="stat">
                <span className="stat-value">{campaign.daysLeft || 'N/A'}</span>
                <span className="stat-label">Days Left</span>
              </div>
            </div>
          </div>

          <button onClick={handleDonate} className="donate-btn-large">
            Donate Now
          </button>

          <div className="transparency-section">
            <h3>Transparency & Reports</h3>
            <p>This NGO maintains full transparency. View detailed reports of fund allocation below:</p>
            <ul className="transparency-items">
              <li>Monthly expense reports</li>
              <li>Beneficiary impact data</li>
              <li>Fund allocation breakdown</li>
              <li>Project progress updates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="campaign-description">
        <h2>About This Campaign</h2>
        <p>{campaign.description}</p>
        <p>This is an important campaign run by {campaign.ngoName}, a verified organization committed to making a positive impact in the community. Your contribution will directly help us achieve our goals and create lasting change.</p>
      </div>

      <div className="related-campaigns">
        <h2>Other Campaigns by This NGO</h2>
        <div className="related-grid">
          {campaigns
            .filter((c) => c.ngoId === campaign.ngoId && (c._id !== campaign._id && c.id !== campaign.id))
            .map((c) => (
              <Link key={c._id || c.id} to={`/campaign/${c._id || c.id}`} className="related-card">
                <img src={c.image} alt={c.title} />
                <h4>{c.title}</h4>
              </Link>
            ))}
        </div>
      </div>

      {showDonationModal && (
        <DonationModal
          campaign={campaign}
          onClose={() => setShowDonationModal(false)}
          user={user}
        />
      )}
    </div>
  )
}

const DonationModal = ({ campaign, onClose, user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('')
  const [donorName, setDonorName] = useState(user?.name || '')
  const [donorEmail, setDonorEmail] = useState(user?.email || '')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    // Send the actual MongoDB _id as campaignId
    const campaignId = campaign._id || campaign.id
    console.log('Submitting donation with campaignId:', campaignId)

    dispatch(
      setCurrentDonation({
        ...campaign,  // Include full campaign object
        campaignId: campaignId,  // Use MongoDB _id
        campaignTitle: campaign.title,
        amount: parseFloat(amount),
        donorName: isAnonymous ? 'Anonymous' : donorName,
        donorEmail: isAnonymous ? '' : donorEmail,
        isAnonymous,
        ngoName: campaign.ngoName,
      })
    )

    navigate('/checkout')
  }

  const quickAmounts = [100, 500, 1000, 5000, 10000]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Donate to {campaign.title}</h2>

        <form onSubmit={handleSubmit} className="donation-form">
          <div className="form-group">
            <label>Donation Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="quick-amounts">
            <label>Quick amounts:</label>
            <div className="amount-buttons">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={amount === q.toString() ? 'amount-btn active' : 'amount-btn'}
                  onClick={() => setAmount(q.toString())}
                >
                  ₦{q}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">Donate anonymously</label>
          </div>

          {!isAnonymous && (
            <>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Email</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary full-width">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  )
}

export default CampaignDetail
