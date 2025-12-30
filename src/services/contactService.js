import axios from 'axios'

const API_BASE_URL = 'https://back-project-kmdb.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    console.log('[ContactService] Response success:', {
      status: response.status,
      url: response.config.url,
      hasData: !!response.data,
    })
    return response
  },
  (error) => {
    console.error('[ContactService] Request error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })
    return Promise.reject(error)
  }
)

const contactService = {
  submitMessage: async (data) => {
    try {
      console.log('[ContactService] Submitting contact form:', {
        name: data.name,
        email: data.email,
        subject: data.subject,
      })
      
      const response = await apiClient.post('/contact/submit', data)
      
      if (!response.data) {
        throw new Error('No data in response')
      }
      
      console.log('[ContactService] Message submitted successfully:', {
        success: response.data.success,
        userEmailSent: response.data.userEmailSent,
        adminEmailSent: response.data.adminEmailSent,
      })
      
      return response
    } catch (error) {
      console.error('[ContactService] Submit message error:', error.message)
      throw error
    }
  },

  getAllMessages: async () => {
    try {
      console.log('[ContactService] Fetching all messages')
      const response = await apiClient.get('/contact/all')
      console.log('[ContactService] Retrieved messages:', response.data?.length || 0)
      return response
    } catch (error) {
      console.error('[ContactService] Get all messages error:', error.message)
      throw error
    }
  },

  markAsAttended: async (messageId) => {
    try {
      console.log('[ContactService] Marking message as attended:', messageId)
      const response = await apiClient.patch(`/contact/${messageId}/mark-attended`)
      console.log('[ContactService] Message marked as attended')
      return response
    } catch (error) {
      console.error('[ContactService] Mark as attended error:', error.message)
      throw error
    }
  },

  deleteMessage: async (messageId) => {
    try {
      console.log('[ContactService] Deleting message:', messageId)
      const response = await apiClient.delete(`/contact/${messageId}`)
      console.log('[ContactService] Message deleted successfully')
      return response
    } catch (error) {
      console.error('[ContactService] Delete message error:', error.message)
      throw error
    }
  },
}

export default contactService
