import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { signupSuccess, signupStart, signupFailure } from '../store/slices/authSlice'
import Notification from '../components/Notification'
import '../styles/Auth.css'
import { useState } from 'react'

const API_URL = 'https://back-project-7y6z.onrender.com'

const adminSignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

const AdminSignup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (values) => {
    setLoading(true)
    setError(null)
    dispatch(signupStart())

    try {
      const response = await fetch(`${API_URL}/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Admin signup failed')
      }

      const userData = {
        name: 'Admin User',
        email: values.email,
        role: 'admin',
        id: data.user?.id || Math.random().toString(36).substr(2, 9),
      }
      
      dispatch(signupSuccess(userData))
      setSuccessMessage('Sign up successful!, please check your inbox for verification')
      
      setTimeout(() => {
        navigate('/signin')
      }, 2000)
    } catch (err) {
      setError(err.message)
      dispatch(signupFailure(err.message))
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
        <h2>Admin Registration</h2>
        <p className="auth-subtitle">Register as administrator</p>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <Formik 
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }} 
          validationSchema={adminSignupSchema} 
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="auth-form">
              <div className="form-group">
                <label>Admin Email Address</label>
                <Field name="email" type="email" placeholder="Enter admin email" />
                <ErrorMessage name="email" component="span" className="error" />
              </div>

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

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register as Admin'}
              </button>

              <p className="auth-link">
                Already have an account? <Link to="/signin">Sign In</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AdminSignup
