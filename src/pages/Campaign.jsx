import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import CampaignCard from '../components/CampaignCard'
import '../styles/Campaign.css'

const Campaign = () => {
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const activeCampaigns = campaigns.filter((c) => c.status === 'active' || c.status === 'approved')
  const categories = ['All', ...new Set(activeCampaigns.map((c) => c.category))]

  const filteredCampaigns = useMemo(() => {
    let filtered = activeCampaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'mostFunded') {
      filtered.sort((a, b) => b.raisedAmount - a.raisedAmount)
    } else if (sortBy === 'endingSoon') {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft)
    }

    return filtered
  }, [activeCampaigns, searchTerm, selectedCategory, sortBy])

  return (
    <div className="campaigns-page">
      <div className="campaigns-header">
        <h1>Donation Campaigns</h1>
        <p>Find campaigns you want to support</p>
      </div>

      <div className="campaigns-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search campaigns, NGOs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="category-filter">
            <label>Category:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-filter">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="mostFunded">Most Funded</option>
              <option value="endingSoon">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      <div className="campaigns-stats">
        <p>Showing {filteredCampaigns.length} campaigns</p>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className="campaigns-list">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="no-campaigns">
          <p>No campaigns found matching your criteria.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All') }} className="reset-btn">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Campaign
