import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  campaigns: [],
  loading: false,
  error: null,
}

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    fetchCampaignsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCampaignsSuccess: (state, action) => {
      state.campaigns = action.payload.map((campaign) => ({
        ...campaign,
        id: campaign.id || campaign._id,
        _id: campaign._id,
      }))
      state.loading = false
    },
    fetchCampaignsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addCampaign: (state, action) => {
      const campaign = action.payload
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
    },
    verifyCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload || c._id === action.payload)
      if (campaign) {
        campaign.verified = true
        campaign.status = 'active'
      }
    },
    rejectCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload || c._id === action.payload)
      if (campaign) {
        campaign.status = 'rejected'
      }
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload && c._id !== action.payload)
    },
    updateCampaignFunding: (state, action) => {
      const { campaignId, amount } = action.payload
      const campaign = state.campaigns.find((c) => c.id === campaignId || c._id === campaignId)
      if (campaign) {
        campaign.raisedAmount += amount
        campaign.donors = (campaign.donors || 0) + 1
        campaign.totalDonorsCount = (campaign.totalDonorsCount || 0) + 1
      }
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
