import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  donations: [],
  currentDonation: null,
  loading: false,
  error: null,
}

// Load donations from localStorage on app start
const loadDonationsFromStorage = () => {
  try {
    const stored = localStorage.getItem('donations_cache')
    const donations = stored ? JSON.parse(stored) : []
    console.log('[donationSlice] Loaded donations from localStorage:', donations.length, 'donations')
    return donations
  } catch (error) {
    console.error('Error loading donations from localStorage:', error)
    return []
  }
}

// Save donations to localStorage
const saveDonationsToStorage = (donations) => {
  try {
    localStorage.setItem('donations_cache', JSON.stringify(donations))
    console.log('[donationSlice] Saved donations to localStorage:', donations.length, 'donations')
  } catch (error) {
    console.error('Error saving donations to localStorage:', error)
  }
}

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    ...initialState,
    donations: loadDonationsFromStorage(),
  },
  reducers: {
    setCurrentDonation: (state, action) => {
      state.currentDonation = action.payload
    },
    addDonation: (state, action) => {
      const newDonation = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: new Date().toISOString(),
        status: 'completed',
      }
      state.donations.push(newDonation)
      state.currentDonation = null
      
      // Save to localStorage
      saveDonationsToStorage(state.donations)
    },
    fetchDonationsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchDonationsSuccess: (state, action) => {
      console.log('[donationSlice] fetchDonationsSuccess - incoming donations:', action.payload.length)
      
      // Merge incoming donations with existing ones
      const incomingDonations = action.payload
      const incomingIds = new Set(incomingDonations.map(d => d._id || d.id))
      const preservedDonations = state.donations.filter(d => !incomingIds.has(d._id || d.id))
      
      state.donations = [...incomingDonations, ...preservedDonations]
      state.loading = false
      
      // Save to localStorage
      saveDonationsToStorage(state.donations)
    },
    fetchDonationsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearCurrentDonation: (state) => {
      state.currentDonation = null
    },
  },
})

export const {
  setCurrentDonation,
  addDonation,
  fetchDonationsStart,
  fetchDonationsSuccess,
  fetchDonationsFailure,
  clearCurrentDonation,
} = donationSlice.actions

export default donationSlice.reducer
