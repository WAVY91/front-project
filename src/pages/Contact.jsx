import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import contactService from '../services/contactService'
import '../styles/Contact.css'

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
})

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      console.log('[Contact] Submitting message from:', values.email)
      
      const response = await contactService.submitMessage(values)
      
      if (!response || !response.data) {
        console.error('[Contact] Invalid response format')
        throw new Error('Invalid response from server')
      }

      console.log('[Contact] Response received:', { 
        success: response.data.success, 
        message: response.data.message,
        userEmailSent: response.data.userEmailSent,
        adminEmailSent: response.data.adminEmailSent
      })

      if (response.data.success) {
        const userEmailStatus = response.data.userEmailSent !== false 
          ? '✓ Confirmation email sent to your inbox.'
          : '⚠ We had trouble sending your confirmation email. Please check your spam folder.'
        
        const adminEmailStatus = response.data.adminEmailSent !== false 
          ? '✓ Our team has been notified.'
          : '⚠ We had trouble notifying our team.'
        
        const completeMessage = `Your message has been received successfully! ${userEmailStatus} ${adminEmailStatus} We will get back to you shortly thanks.`
        
        setSuccessMessage(completeMessage)
        console.log('[Contact] Message submitted successfully for:', values.email)
        resetForm()
        setTimeout(() => setSuccessMessage(''), 7000)
      } else {
        const errorMsg = response.data.message || 'Failed to send message'
        console.error('[Contact] Submission failed:', errorMsg)
        setErrorMessage(errorMsg)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred while sending your message'
      console.error('[Contact] Error:', errorMsg, err)
      
      if (err.response?.status === 500) {
        setErrorMessage('Server error. Please try again later or contact us directly at timetomisin@gmail.com')
      } else if (err.response?.status === 400) {
        setErrorMessage('Please check your input and try again.')
      } else {
        setErrorMessage(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <h3>Email</h3>
                <p><a href="mailto:hello@goodheart.org">timetomisin@gmail.com</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h3>Phone</h3>
                <p><a href="tel:+919876543210">+234 70 39692720</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h3>Address</h3>
                <p>No: 21, Akapo Street off Oke-Koto Bstop, Agege, Lagos State.</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-text">
                <h3>Hours</h3>
                <p>Monday - Friday: 9 AM - 5 PM<br />Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Formik
            initialValues={{
              name: '',
              email: '',
              subject: '',
              message: '',
            }}
            validationSchema={contactSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="contact-form">
                <div className="form-group">
                  <label>Name</label>
                  <Field name="name" type="text" placeholder="Your name" />
                  <ErrorMessage name="name" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <Field name="email" type="email" placeholder="Your email" />
                  <ErrorMessage name="email" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <Field name="subject" type="text" placeholder="Message subject" />
                  <ErrorMessage name="subject" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <Field name="message" as="textarea" placeholder="Your message" rows="5" />
                  <ErrorMessage name="message" component="span" className="error" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Contact
