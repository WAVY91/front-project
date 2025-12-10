import axios from 'axios'

const API_BASE_URL = 'https://back-project-1zhw.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const contactService = {
  submitMessage: (data) => apiClient.post('/contact/submit', data),
  getAllMessages: () => apiClient.get('/contact/all'),
  markAsAttended: (messageId) => apiClient.patch(`/contact/${messageId}/mark-attended`),
  deleteMessage: (messageId) => apiClient.delete(`/contact/${messageId}`),
  // Optional endpoints: backend may implement these to send emails
  notifyAdmin: (data) => apiClient.post('/contact/notify-admin', data),
  sendConfirmation: (data) => apiClient.post('/contact/send-confirmation', data),
}

export default contactService
