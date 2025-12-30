import axios from 'axios'

const API_BASE_URL = 'https://back-project-t871.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('[ApiService] Request:', { 
    method: config.method.toUpperCase(), 
    url: config.url 
  })
  return config
}, (error) => Promise.reject(error))

apiClient.interceptors.response.use(
  (response) => {
    console.log('[ApiService] Response success:', {
      status: response.status,
      url: response.config.url,
      emailSent: response.data?.emailSent,
    })
    return response
  },
  (error) => {
    console.error('[ApiService] Request error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })
    return Promise.reject(error)
  }
)

const authService = {
  donorSignup: async (data) => {
    try {
      console.log('[ApiService] Starting donor signup for:', data.email)
      const response = await apiClient.post('/donor/signup', data)
      console.log('[ApiService] Donor signup response:', {
        emailSent: response.data?.emailSent,
        userId: response.data?.user?.id,
      })
      return response
    } catch (error) {
      console.error('[ApiService] Donor signup error:', error.message)
      throw error
    }
  },

  donorSignin: async (data) => {
    try {
      console.log('[ApiService] Donor signin for:', data.email)
      const response = await apiClient.post('/donor/signin', data)
      return response
    } catch (error) {
      console.error('[ApiService] Donor signin error:', error.message)
      throw error
    }
  },

  adminSignup: async (data) => {
    try {
      console.log('[ApiService] Starting admin signup for:', data.email)
      const response = await apiClient.post('/admin/signup', data)
      console.log('[ApiService] Admin signup response:', {
        emailSent: response.data?.emailSent,
        userId: response.data?.user?.id,
      })
      return response
    } catch (error) {
      console.error('[ApiService] Admin signup error:', error.message)
      throw error
    }
  },

  adminSignin: async (data) => {
    try {
      console.log('[ApiService] Admin signin for:', data.email)
      const response = await apiClient.post('/admin/signin', data)
      return response
    } catch (error) {
      console.error('[ApiService] Admin signin error:', error.message)
      throw error
    }
  },

  ngoSignup: async (data) => {
    try {
      console.log('[ApiService] Starting NGO signup for:', data.email)
      const response = await apiClient.post('/ngo/signup', data)
      console.log('[ApiService] NGO signup response:', {
        emailSent: response.data?.emailSent,
        userId: response.data?.user?.id,
      })
      return response
    } catch (error) {
      console.error('[ApiService] NGO signup error:', error.message)
      throw error
    }
  },

  ngoSignin: async (data) => {
    try {
      console.log('[ApiService] NGO signin for:', data.email)
      const response = await apiClient.post('/ngo/signin', data)
      return response
    } catch (error) {
      console.error('[ApiService] NGO signin error:', error.message)
      throw error
    }
  },

  getAllNGOs: async () => {
    try {
      console.log('[ApiService] Fetching all NGOs')
      const response = await apiClient.get('/ngo/all')
      console.log('[ApiService] Retrieved NGOs:', response.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ApiService] Get all NGOs error:', error.message)
      throw error
    }
  },

  getActiveCampaigns: async () => {
    try {
      console.log('[ApiService] Fetching active campaigns from backend')
      const response = await apiClient.get('/donor/campaigns/active')
      console.log('[ApiService] Retrieved active campaigns:', response.data?.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ApiService] Get active campaigns error:', error.message)
      throw error
    }
  },

  getNGOCampaigns: async (ngoId) => {
    try {
      console.log('[ApiService] Fetching campaigns for NGO:', ngoId)
      const response = await apiClient.get(`/ngo/${ngoId}/campaigns`)
      console.log('[ApiService] Retrieved NGO campaigns:', response.data?.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ApiService] Get NGO campaigns error:', error.message)
      throw error
    }
  },

  getPendingNGOs: async () => {
    try {
      console.log('[ApiService] Fetching pending NGOs')
      const response = await apiClient.get('/admin/pending-ngos')
      console.log('[ApiService] Retrieved pending NGOs:', response.data?.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ApiService] Get pending NGOs error:', error.message)
      throw error
    }
  },

  getAllNGOs: async () => {
    try {
      console.log('[ApiService] Fetching all NGOs')
      const response = await apiClient.get('/admin/all-ngos')
      console.log('[ApiService] Retrieved all NGOs:', response.data?.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ApiService] Get all NGOs error:', error.message)
      throw error
    }
  },

export default authService
