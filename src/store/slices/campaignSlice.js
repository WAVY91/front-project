import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  campaigns: [],
  loading: false,
  error: null,
  lastFetchTime: null,
}

// Load campaigns from localStorage on app start
const loadCampaignsFromStorage = () => {
  try {
    const stored = localStorage.getItem('campaigns_cache')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading campaigns from localStorage:', error)
    return []
  }
}

// Save campaigns to localStorage
const saveCampaignsToStorage = (campaigns) => {
  try {
    localStorage.setItem('campaigns_cache', JSON.stringify(campaigns))
  } catch (error) {
    console.error('Error saving campaigns to localStorage:', error)
  }
}

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState: {
    ...initialState,
    campaigns: loadCampaignsFromStorage(),
  },
  reducers: {
    fetchCampaignsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCampaignsSuccess: (state, action) => {
      const incomingCampaigns = action.payload.map((campaign) => ({
        ...campaign,
        id: campaign.id || campaign._id,
        _id: campaign._id,
      }))
      
      // Merge incoming campaigns with existing ones
      // Keep existing campaigns that are not in the incoming list
      const incomingIds = new Set(incomingCampaigns.map(c => c._id || c.id))
      const preservedCampaigns = state.campaigns.filter(c => !incomingIds.has(c._id || c.id))
      
      // Combine: incoming campaigns (to sync backend changes) + preserved campaigns (local ones)
      state.campaigns = [...incomingCampaigns, ...preservedCampaigns]
      state.loading = false
      state.lastFetchTime = Date.now()
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    fetchCampaignsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addCampaign: (state, action) => {
      const campaign = action.payload
      
      // Check if campaign already exists
      const existingIndex = state.campaigns.findIndex(
        c => (c._id || c.id) === (campaign._id || campaign.id)
      )
      
      if (existingIndex !== -1) {
        // Update existing campaign
        state.campaigns[existingIndex] = {
          ...state.campaigns[existingIndex],
          ...campaign,
          id: campaign.id || campaign._id || state.campaigns[existingIndex].id,
          _id: campaign._id || state.campaigns[existingIndex]._id,
        }
      } else {
        // Add new campaign
        const newCampaign = {
          ...campaign,
          id: campaign.id || campaign._id || (state.campaigns.length + 1),
          _id: campaign._id,
          raisedAmount: campaign.raisedAmount || 0,
          donors: campaign.donors || 0,
          verified: campaign.verified || false,
          status: campaign.status || 'active',
        }
        state.campaigns.push(newCampaign)
      }
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    updateCampaign: (state, action) => {
      const updatedCampaign = action.payload
      const index = state.campaigns.findIndex((c) => c.id === updatedCampaign.id || c._id === updatedCampaign._id)
      if (index !== -1) {
        state.campaigns[index] = {
          ...state.campaigns[index],
          ...updatedCampaign,
          id: updatedCampaign.id || updatedCampaign._id || state.campaigns[index].id,
          _id: updatedCampaign._id || state.campaigns[index]._id
        }
      }
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    verifyCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload || c._id === action.payload)
      if (campaign) {
        campaign.verified = true
        campaign.status = 'active'
      }
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    rejectCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload || c._id === action.payload)
      if (campaign) {
        campaign.status = 'rejected'
      }
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload && c._id !== action.payload)
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
    updateCampaignFunding: (state, action) => {
      const { campaignId, amount } = action.payload
      const campaign = state.campaigns.find((c) => c.id === campaignId || c._id === campaignId)
      if (campaign) {
        campaign.raisedAmount += amount
        if (Array.isArray(campaign.donors)) {
          // If it's an array, we can't easily add the new donor object here without more info,
          // but we should at least not crash. The next fetch will update it correctly.
          // For now, we don't push to avoid state inconsistency if backend structure is complex.
        } else {
          campaign.donors = (campaign.donors || 0) + 1
        }
        campaign.totalDonorsCount = (campaign.totalDonorsCount || 0) + 1
      }
      
      // Save to localStorage
      saveCampaignsToStorage(state.campaigns)
    },
  },
})

export const {
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
  addCampaign,
  updateCampaign,
  verifyCampaign,
  rejectCampaign,
  deleteCampaign,
  updateCampaignFunding,
} = campaignSlice.actions

export default campaignSlice.reducer
