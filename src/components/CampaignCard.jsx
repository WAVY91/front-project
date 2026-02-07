import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/CampaignCard.css'

const CampaignCard = ({ campaign }) => {
  const raisedAmount = campaign.raisedAmount || 0
  const goalAmount = campaign.goalAmount || 1
  const progressPercentage = (raisedAmount / goalAmount) * 100
  const category = campaign.category || 'Other'
  
  // Different fallback images based on category
  const categoryImages = {
    'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'Healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800',
    'Electricity': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    'Food': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'Shelter': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
    'Other': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'
  }
  
  const imageUrl = campaign.image || categoryImages[category] || categoryImages['Other']
  const donorsCount = Array.isArray(campaign.donors) ? campaign.donors.length : (campaign.donors || campaign.totalDonorsCount || 0)
  const daysLeft = campaign.daysLeft || 30

  return (
    <Link to={`/campaign/${campaign._id || campaign.id}`} className="campaign-card-link">
      <div className="campaign-card">
        <div className="campaign-image">
          <img 
            src={imageUrl} 
            alt={campaign.title}
            loading="lazy"
            onError={(e) => {
              const fallback = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'
              if (e.target.src !== fallback) {
                e.target.src = fallback
              }
            }}
          />
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
              <span className="meta-value">{donorsCount}</span>
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
