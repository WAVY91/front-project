import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  campaigns: [
    {
      id: 1,
      title: 'Clean Water Initiative',
      description: 'Provide clean drinking water to rural communities',
      ngoName: 'Water for All',
      ngoId: 1,
      goalAmount: 500000000,
      raisedAmount: 150000000,
      image: 'https://images.unsplash.com/photo-1601662583487-20630f298aed?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 15,
      donors: 234,
      category: 'Health',
      verified: true,
    },
    {
      id: 2,
      title: 'Education for Children',
      description: 'Build schools in underprivileged areas',
      ngoName: 'Bright Future',
      ngoId: 2,
      goalAmount: 400000000,
      raisedAmount: 50000000,
      image: 'https://images.unsplash.com/photo-1584789874194-b82d600b16f4?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 22,
      donors: 156,
      category: 'Education',
      verified: true,
    },
    {
      id: 3,
      title: 'Medical Relief Camp',
      description: 'Emergency medical aid for disaster victims',
      ngoName: 'Health Care Plus',
      ngoId: 3,
      goalAmount: 550000000,
      raisedAmount: 150000000,
      image: 'https://images.unsplash.com/photo-1694286068362-5dcea7ed282a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 8,
      donors: 412,
      category: 'Emergency',
      verified: true,
    },
    {
      id: 4,
      title: 'Solar Energy for Villages',
      description: 'Install solar panels in remote villages for sustainable electricity',
      ngoName: 'Green Energy NGO',
      ngoId: 4,
      goalAmount: 600000000,
      raisedAmount: 100000000,
      image: 'https://images.unsplash.com/photo-1579710039152-104af146bf92?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 18,
      donors: 289,
      category: 'Electricity',
      verified: true,
    },
    {
      id: 5,
      title: 'Food Security Program',
      description: 'Provide nutritious meals to underfed children and families',
      ngoName: 'Feed the Need',
      ngoId: 5,
      goalAmount: 600000000,
      raisedAmount: 150000000,
      image: 'https://images.unsplash.com/photo-1694286068561-3233c946e9be?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 12,
      donors: 367,
      category: 'Food',
      verified: true,
    },
    {
      id: 6,
      title: 'Emergency Shelter Initiative',
      description: 'Build emergency shelters for homeless and displaced families',
      ngoName: 'Safe Haven',
      ngoId: 6,
      goalAmount: 800000000,
      raisedAmount: 200000000,
      image: 'https://images.unsplash.com/photo-1584789922574-5a2d874f335c?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'active',
      daysLeft: 25,
      donors: 198,
      category: 'Shelter',
      verified: true,
    },
  ],
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
      state.campaigns = action.payload
      state.loading = false
    },
    fetchCampaignsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addCampaign: (state, action) => {
      const newCampaign = {
        id: state.campaigns.length + 1,
        ...action.payload,
        raisedAmount: 0,
        donors: 0,
        verified: false,
        status: 'pending',
      }
      state.campaigns.push(newCampaign)
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.campaigns[index] = action.payload
      }
    },
    verifyCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload)
      if (campaign) {
        campaign.verified = true
        campaign.status = 'active'
      }
    },
    rejectCampaign: (state, action) => {
      const campaign = state.campaigns.find((c) => c.id === action.payload)
      if (campaign) {
        campaign.status = 'rejected'
      }
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload)
    },
    updateCampaignFunding: (state, action) => {
      const { campaignId, amount } = action.payload
      const campaign = state.campaigns.find((c) => c.id === campaignId)
      if (campaign) {
        campaign.raisedAmount += amount
        campaign.donors += 1
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
