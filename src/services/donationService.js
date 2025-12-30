import axios from 'axios'

const API_BASE_URL = 'https://back-project-kmdb.onrender.com'

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

const donationService = {
  submitDonation: (data) => apiClient.post('/donation/submit', data),
  getDonationsByDonor: (donorId) => apiClient.get(`/donation/donor/${donorId}`),
  getDonationsByNGO: (ngoId) => apiClient.get(`/donation/ngo/${ngoId}`),
  getDonationById: (donationId) => apiClient.get(`/donation/${donationId}`),
  getAllDonations: () => apiClient.get('/donation/all'),
}

export default donationService
