import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { loginSuccess, loginStart, loginFailure } from '../store/slices/authSlice'
import Notification from '../components/Notification'
import '../styles/Auth.css'

const API_URL = 'https://back-project-kmdb.onrender.com'

const signinSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().required('Please select your role'),
})

const Signin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (values) => {
    setLoading(true)
    setError(null)
    dispatch(loginStart())

    try {
      let endpoint = ''
      if (values.role === 'donor') {
        endpoint = `${API_URL}/donor/signin`
      } else if (values.role === 'ngo') {
        endpoint = `${API_URL}/ngo/signin`
      } else if (values.role === 'admin') {
        endpoint = `${API_URL}/admin/signin`
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const userData = data.user
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      dispatch(loginSuccess(userData))
      setSuccessMessage('Sign in Successful!')

      setTimeout(() => {
        if (userData.role === 'ngo') {
          navigate('/ngo-dashboard')
        } else if (userData.role === 'donor') {
          navigate('/donor-dashboard')
        } else if (userData.role === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/')
        }
      }, 1500)
    } catch (err) {
      setError(err.message)
      dispatch(loginFailure(err.message))
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
        <h2>Sign In</h2>
        <p className="auth-subtitle">Welcome back to our charity platform</p>

        {error && <div className="error-message">{error}</div>}

        <Formik
          initialValues={{
            email: '',
            password: '',
            role: 'donor',
          }}
          validationSchema={signinSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="auth-form">
              <div className="role-selector" style={{ marginBottom: '20px' }}>
                <label className={values.role === 'donor' ? 'role-btn active' : 'role-btn'}>
                  <Field type="radio" name="role" value="donor" onChange={() => setFieldValue('role', 'donor')} />
                  <span>Donor</span>
                </label>
                <label className={values.role === 'ngo' ? 'role-btn active' : 'role-btn'}>
                  <Field type="radio" name="role" value="ngo" onChange={() => setFieldValue('role', 'ngo')} />
                  <span>NGO</span>
                </label>
                <label className={values.role === 'admin' ? 'role-btn active' : 'role-btn'}>
                  <Field type="radio" name="role" value="admin" onChange={() => setFieldValue('role', 'admin')} />
                  <span>Admin</span>
                </label>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <Field name="email" type="email" placeholder="Enter your email" />
                <ErrorMessage name="email" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <Field name="password" type="password" placeholder="Enter password" />
                <ErrorMessage name="password" component="span" className="error" />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="auth-link">
                Don't have an account? <Link to="/signup">Create Account</Link>
              </p>
              <p className="auth-link">
                Admin login? <Link to="/admin-signup">Admin Registration</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signin
