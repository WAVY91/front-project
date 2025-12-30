import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/CampaignCard.css'

const CampaignCard = ({ campaign }) => {
  const progressPercentage = (campaign.raisedAmount / campaign.goalAmount) * 100

  return (
    <Link to={`/campaign/${campaign._id || campaign.id}`} className="campaign-card-link">
      <div className="campaign-card">
        <div className="campaign-image">
          <img src={campaign.image} alt={campaign.title} />
          <span className="campaign-status">{campaign.status === 'active' || campaign.status === 'approved' ? '✓ Active' : campaign.status === 'pending' ? 'Pending' : 'Rejected'}</span>
        </div>
        <div className="campaign-content">
          <div className="campaign-header">
            <h3>{campaign.title}</h3>
            <span className="campaign-category">{campaign.category}</span>
          </div>
          <p className="campaign-ngo">{campaign.ngoName}</p>
          <p className="campaign-desc">{campaign.description}</p>

          <div className="campaign-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="progress-text">
              <span className="raised">₦{campaign.raisedAmount.toLocaleString()}</span>
              <span className="goal">/ ₦{campaign.goalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="campaign-meta">
            <div className="meta-item">
              <span className="meta-label">Donors</span>
              <span className="meta-value">{campaign.donors}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Days Left</span>
              <span className="meta-value">{campaign.daysLeft}</span>
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
