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

const authService = {
  donorSignup: (data) => apiClient.post('/donor/signup', data),
  donorSignin: (data) => apiClient.post('/donor/signin', data),
  adminSignup: (data) => apiClient.post('/admin/signup', data),
  adminSignin: (data) => apiClient.post('/admin/signin', data),
  ngoSignup: (data) => apiClient.post('/ngo/signup', data),
  ngoSignin: (data) => apiClient.post('/ngo/signin', data),
  getAllNGOs: () => apiClient.get('/ngo/all'),
  createCampaign: (data) => apiClient.post('/campaign/create', data),
  getAllCampaigns: () => apiClient.get('/campaign/all'),
  getActiveCampaigns: () => apiClient.get('/campaign/all?status=active'),
  getCampaignById: (id) => apiClient.get(`/campaign/${id}`),
  updateCampaign: (id, data) => apiClient.patch(`/campaign/${id}`, data),
  deleteCampaign: (id) => apiClient.delete(`/campaign/${id}`),
  getNGOCampaigns: (ngoId) => apiClient.get(`/campaign/ngo/${ngoId}`),
}

export default authService
