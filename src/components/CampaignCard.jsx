import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/CampaignCard.css'

const CampaignCard = ({ campaign }) => {
  const raisedAmount = campaign.raisedAmount || 0
  const goalAmount = campaign.goalAmount || 1
  const progressPercentage = (raisedAmount / goalAmount) * 100
  const imageUrl = campaign.image || 'https://images.unsplash.com/photo-1532996122724-8f3c19b7da4d?q=80&w=870&auto=format&fit=crop'
  const category = campaign.category || 'Other'
  const donors = campaign.donors || campaign.totalDonorsCount || 0
  const daysLeft = campaign.daysLeft || 30

  return (
    <Link to={`/campaign/${campaign._id || campaign.id}`} className="campaign-card-link">
      <div className="campaign-card">
        <div className="campaign-image">
          <img src={imageUrl} alt={campaign.title} onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1532996122724-8f3c19b7da4d?q=80&w=870&auto=format&fit=crop'
          }} />
          <span className="campaign-status">{campaign.status === 'active' || campaign.status === 'approved' ? '✓ Active' : campaign.status === 'pending' ? 'Pending' : 'Rejected'}</span>
        </div>
        <div className="campaign-content">
          <div className="campaign-header">
            <h3>{campaign.title}</h3>
            <span className="campaign-category">{category}</span>
          </div>
          <p className="campaign-ngo">{campaign.ngoName || 'Organization'}</p>
          <p className="campaign-desc">{campaign.description}</p>

          <div className="campaign-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
            </div>
            <div className="progress-text">
              <span className="raised">₦{raisedAmount.toLocaleString()}</span>
              <span className="goal">/ ₦{goalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="campaign-meta">
            <div className="meta-item">
              <span className="meta-label">Donors</span>
              <span className="meta-value">{donors}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Days Left</span>
              <span className="meta-value">{daysLeft}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Progress</span>
              <span className="meta-value">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          <button className="donate-btn">Donate Now</button>
        </div>
      </div>
    </Link>
  )
}

export default CampaignCard
