import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { signupSuccess, signupStart, signupFailure } from '../store/slices/authSlice'
import { registerNGO } from '../store/slices/userSlice'
import Notification from '../components/Notification'
import '../styles/Auth.css'

const API_URL = 'https://back-project-q78l.onrender.com'

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
.oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Please select a role'),
  ngoName: Yup.string().when('role', {
    is: 'ngo',
    then: (schema) => schema.required('Organization name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ngoDescription: Yup.string().when('role', {
    is: 'ngo',
    then: (schema) => schema.required('Organization description is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
})

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedRole, setSelectedRole] = useState('donor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (values) => {
    setLoading(true)
    setError(null)
    dispatch(signupStart())

    try {
      if (values.role === 'donor') {
        console.log('[Signup] Starting donor signup for:', values.email)
        
        const response = await fetch(`${API_URL}/donor/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.message || `Signup failed with status ${response.status}`
          console.error('[Signup] Donor signup error:', errorMessage)
          throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log('[Signup] Donor signup response:', { 
          success: true, 
          emailSent: data.emailSent, 
          userId: data.user?.id 
        })

        const userData = {
          name: values.name,
          email: values.email,
          role: 'donor',
          id: data.user?.id || Math.random().toString(36).substr(2, 9),
        }
        dispatch(signupSuccess(userData))
        
        setSuccessMessage('signup successful!, please check your inbox for email verification.')
        console.log('[Signup] Donor signup completed successfully for:', values.email)
        
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      } else if (values.role === 'ngo') {
        console.log('[Signup] Starting NGO signup for:', values.email)
        
        const response = await fetch(`${API_URL}/ngo/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            ngoName: values.ngoName,
            description: values.ngoDescription,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.message || `NGO registration failed with status ${response.status}`
          console.error('[Signup] NGO signup error:', errorMessage)
          throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log('[Signup] NGO signup response:', { 
          success: true, 
          emailSent: data.emailSent, 
          userId: data.user?.id,
          status: data.status 
        })

        dispatch(
          registerNGO({
            name: values.ngoName,
            email: values.email,
            description: values.ngoDescription,
            registrationDoc: 'pending_verification',
          })
        )

        const userData = {
          name: values.ngoName,
          email: values.email,
          ngoName: values.ngoName,
          ngoDescription: values.ngoDescription,
          role: 'ngo',
          id: data.user?.id || Math.random().toString(36).substr(2, 9),
        }
        dispatch(signupSuccess(userData))
        
        setSuccessMessage('signup successful!, please check your inbox for email verification.')
        console.log('[Signup] NGO signup completed successfully for:', values.email)
        
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred during signup'
      console.error('[Signup] Error:', errorMsg, err)
      setError(errorMsg)
      dispatch(signupFailure(errorMsg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <Notification 
        message={successMessage} 
        type="success" 
        onClose={() => setSuccessMessage(null)} 
      />
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join our charity platform</p>

        {error && <div className="error-message">{error}</div>}

        <Formik initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'donor',
          ngoName: '',
          ngoDescription: '',
          terms: false,
        }} validationSchema={signupSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className="auth-form">
              <div className="role-selector">
                <label className={values.role === 'donor' ? 'role-btn active' : 'role-btn'}>
                  <Field type="radio" name="role" value="donor" onChange={() => {
                    setFieldValue('role', 'donor')
                    setSelectedRole('donor')
                  }} />
                  <span>Donor</span>
                </label>
                <label className={values.role === 'ngo' ? 'role-btn active' : 'role-btn'}>
                  <Field type="radio" name="role" value="ngo" onChange={() => {
                    setFieldValue('role', 'ngo')
                    setSelectedRole('ngo')
                  }} />
                  <span>NGO</span>
                </label>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <Field name="name" type="text" placeholder="Enter your full name" />
                <ErrorMessage name="name" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <Field name="email" type="email" placeholder="Enter your email" />
                <ErrorMessage name="email" component="span" className="error" />
              </div>

              {selectedRole === 'ngo' && (
                <>
                  <div className="form-group">
                    <label>Organization Name</label>
                    <Field name="ngoName" type="text" placeholder="Enter NGO name" />
                    <ErrorMessage name="ngoName" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Organization Description</label>
                    <Field name="ngoDescription" as="textarea" placeholder="Describe your organization" />
                    <ErrorMessage name="ngoDescription" component="span" className="error" />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Password</label>
                <Field name="password" type="password" placeholder="Enter password" />
                <ErrorMessage name="password" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <Field name="confirmPassword" type="password" placeholder="Confirm password" />
                <ErrorMessage name="confirmPassword" component="span" className="error" />
              </div>

              <div className="form-group checkbox">
                <Field name="terms" type="checkbox" />
                <label>I agree to the terms and conditions</label>
                <ErrorMessage name="terms" component="span" className="error" />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="auth-link">
                Already have an account? <Link to="/signin">Sign In</Link>
              </p>
              <p className="auth-link">
                Are you an admin? <Link to="/admin-signup">Admin Registration</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signup
