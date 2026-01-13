import axios from 'axios'

const API_BASE_URL = 'https://back-project-r1ur.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

const campaignService = {
  createCampaign: (data) => apiClient.post('/campaign/add', data),
  getAllCampaigns: () => apiClient.get('/campaign/all'),
  getCampaignById: (id) => apiClient.get(`/campaign/${id}`),
  updateCampaign: (id, data) => apiClient.patch(`/campaign/${id}`, data),
  deleteCampaign: (id) => apiClient.delete(`/campaign/${id}`),
  getNGOCampaigns: (ngoId) => apiClient.get(`/campaign/ngo/${ngoId}`),
}

export default campaignService
