import axios from 'axios'

const API_BASE_URL = 'https://back-project-1zhw.onrender.com'

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
}

export default authService
