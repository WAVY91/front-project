import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CampaignCard from '../components/CampaignCard'
import { fetchCampaignsSuccess } from '../store/slices/campaignSlice'
import apiService from '../services/apiService'
import '../styles/Campaign.css'

const Campaign = () => {
  const dispatch = useDispatch()
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const fetchCampaignsFromBackend = async () => {
      try {
        console.log('[Campaign] Fetching active campaigns from backend')
        const response = await apiService.getActiveCampaigns()
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('[Campaign] Received campaigns from backend:', response.data.data.length)
          dispatch(fetchCampaignsSuccess(response.data.data))
        }
      } catch (error) {
        console.error('[Campaign] Error fetching campaigns from backend:', error.message)
      }
    }

    fetchCampaignsFromBackend()

    const campaignRefreshInterval = setInterval(() => {
      console.log('[Campaign] Auto-refreshing campaigns...')
      fetchCampaignsFromBackend()
    }, 30000)

    return () => clearInterval(campaignRefreshInterval)
  }, [dispatch])

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
      filtered.sort((a, b) => {
        const valA = a._id || a.id;
        const valB = b._id || b.id;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return valB - valA;
        }
        return String(valB).localeCompare(String(valA));
      })
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
            <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />
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
