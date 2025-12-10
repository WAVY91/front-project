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
      const response = await contactService.submitMessage(values)
      if (response.data.success) {
        setSuccessMessage("Your message has been delivered to the admin, we'll get to you shortly.")
        // reset form fields
        resetForm()

        // If backend provides the saved message object, attempt to request email notifications.
        // These endpoints are optional and should be implemented on the backend:
        // POST /contact/notify-admin   -> notify admin by email
        // POST /contact/send-confirmation -> send confirmation email to user
        // Fire-and-forget notification calls: don't await these so the UI isn't blocked
        const saved = response.data.data || null
        contactService
          .notifyAdmin({ messageId: saved?._id || null, ...values })
          .catch((err) => console.warn('notifyAdmin failed:', err?.message || err))

        contactService
          .sendConfirmation({ email: values.email, name: values.name, subject: values.subject })
          .catch((err) => console.warn('sendConfirmation failed:', err?.message || err))

        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrorMessage(response.data.message || 'Failed to send message')
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while sending your message')
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
