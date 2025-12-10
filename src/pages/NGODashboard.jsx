import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { addCampaign, updateCampaign, deleteCampaign } from '../store/slices/campaignSlice'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import '../styles/Dashboard.css'

const campaignSchema = Yup.object().shape({
  title: Yup.string().required('Campaign title is required'),
  description: Yup.string().required('Description is required'),
  goalAmount: Yup.number().min(1000, 'Minimum goal is ₦1000').required('Goal amount is required'),
  category: Yup.string().required('Category is required'),
  daysLeft: Yup.number().min(1, 'Must have at least 1 day').required('Days left is required'),
  image: Yup.string().url('Please enter a valid image URL').required('Campaign image URL is required'),
})

const NGODashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  if (!user || user.role !== 'ngo') {
    return (
      <div className="dashboard-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need to be logged in as an NGO to access this dashboard.</p>
          <button onClick={() => navigate('/signin')} className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const ngoName = user.ngoName || 'Your Organization'
  const ngoCampaigns = campaigns.filter((c) => c.ngoName === ngoName)
  const totalFundsRaised = ngoCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0)
  const totalDonors = ngoCampaigns.reduce((sum, c) => sum + c.donors, 0)

  const handleCreateCampaign = (values) => {
    dispatch(
      addCampaign({
        title: values.title,
        description: values.description,
        ngoName: ngoName,
        ngoId: user.id,
        goalAmount: parseInt(values.goalAmount),
        category: values.category,
        daysLeft: parseInt(values.daysLeft),
        image: values.image,
      })
    )
    setShowCreateForm(false)
  }

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign)
    setShowEditForm(true)
  }

  const handleUpdateCampaign = (values) => {
    dispatch(
      updateCampaign({
        id: editingCampaign.id,
        title: values.title,
        description: values.description,
        ngoName: ngoName,
        ngoId: user.id,
        goalAmount: parseInt(values.goalAmount),
        category: values.category,
        daysLeft: parseInt(values.daysLeft),
        image: values.image,
        raisedAmount: editingCampaign.raisedAmount,
        donors: editingCampaign.donors,
        verified: editingCampaign.verified,
        status: editingCampaign.status,
      })
    )
    setEditingCampaign(null)
    setShowEditForm(false)
  }

  const handleDeleteCampaign = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      dispatch(deleteCampaign(id))
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>NGO Dashboard</h1>
          <p>Organization: {ngoName}</p>
        </div>
        <button onClick={() => { dispatch(logout()); navigate('/'); }} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <h3>Total Funds Raised</h3>
          <p className="stat-value">₦{totalFundsRaised.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <h3>Active Campaigns</h3>
          <p className="stat-value">{ngoCampaigns.filter((c) => c.status === 'active' || c.status === 'approved').length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>Total Donors</h3>
          <p className="stat-value">{totalDonors}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <h3>Total Campaigns</h3>
          <p className="stat-value">{ngoCampaigns.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Campaigns</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ Create Campaign'}
          </button>
        </div>

        {showEditForm && editingCampaign && (
          <div className="create-form-container" style={{ backgroundColor: '#f0f4ff', borderLeft: '4px solid #667eea' }}>
            <h3>Edit Campaign: {editingCampaign.title}</h3>
            <Formik
              initialValues={{
                title: editingCampaign.title,
                description: editingCampaign.description,
                goalAmount: editingCampaign.goalAmount.toString(),
                category: editingCampaign.category,
                daysLeft: editingCampaign.daysLeft.toString(),
                image: editingCampaign.image,
              }}
              validationSchema={campaignSchema}
              onSubmit={handleUpdateCampaign}
            >
              {() => (
                <Form className="campaign-form">
                  <div className="form-group">
                    <label>Campaign Title</label>
                    <Field name="title" type="text" placeholder="Enter campaign title" />
                    <ErrorMessage name="title" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Describe your campaign"
                    />
                    <ErrorMessage name="description" component="span" className="error" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Goal Amount (₦)</label>
                      <Field
                        name="goalAmount"
                        type="number"
                        placeholder="Enter goal amount"
                      />
                      <ErrorMessage name="goalAmount" component="span" className="error" />
                    </div>

                    <div className="form-group">
                      <label>Days for Campaign</label>
                      <Field name="daysLeft" type="number" placeholder="Number of days" />
                      <ErrorMessage name="daysLeft" component="span" className="error" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <Field name="category" as="select">
                      <option>Health</option>
                      <option>Education</option>
                      <option>Emergency</option>
                      <option>Electricity</option>
                      <option>Food</option>
                      <option>Shelter</option>
                    </Field>
                    <ErrorMessage name="category" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Campaign Image URL</label>
                    <Field
                      name="image"
                      type="url"
                      placeholder="Enter campaign image URL (e.g., https://...)"
                    />
                    <ErrorMessage name="image" component="span" className="error" />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">
                      Update Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCampaign(null)
                        setShowEditForm(false)
                      }}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {showCreateForm && (
          <div className="create-form-container">
            <Formik
              initialValues={{
                title: '',
                description: '',
                goalAmount: '',
                category: 'Health',
                daysLeft: '30',
                image: '',
              }}
              validationSchema={campaignSchema}
              onSubmit={handleCreateCampaign}
            >
              {() => (
                <Form className="campaign-form">
                  <div className="form-group">
                    <label>Campaign Title</label>
                    <Field name="title" type="text" placeholder="Enter campaign title" />
                    <ErrorMessage name="title" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Describe your campaign"
                    />
                    <ErrorMessage name="description" component="span" className="error" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Goal Amount (₦)</label>
                      <Field
                        name="goalAmount"
                        type="number"
                        placeholder="Enter goal amount"
                      />
                      <ErrorMessage name="goalAmount" component="span" className="error" />
                    </div>

                    <div className="form-group">
                      <label>Days for Campaign</label>
                      <Field name="daysLeft" type="number" placeholder="Number of days" />
                      <ErrorMessage name="daysLeft" component="span" className="error" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <Field name="category" as="select">
                      <option>Health</option>
                      <option>Education</option>
                      <option>Emergency</option>
                      <option>Electricity</option>
                      <option>Food</option>
                      <option>Shelter</option>
                    </Field>
                    <ErrorMessage name="category" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Campaign Image URL</label>
                    <Field
                      name="image"
                      type="url"
                      placeholder="Enter campaign image URL (e.g., https://...)"
                    />
                    <ErrorMessage name="image" component="span" className="error" />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {ngoCampaigns.length > 0 ? (
          <div className="campaigns-list">
            {ngoCampaigns.map((campaign) => {
              const progressPercentage = (campaign.raisedAmount / campaign.goalAmount) * 100
              return (
                <div key={campaign.id} className="campaign-card-dashboard">
                  <div className="campaign-card-image">
                    <img src={campaign.image} alt={campaign.title} />
                  </div>
                  <div className="campaign-card-info">
                    <h3>{campaign.title}</h3>
                    <p>{campaign.description}</p>
                    <div className="campaign-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="progress-text">
                        ₦{campaign.raisedAmount.toLocaleString()} / ₦
                        {campaign.goalAmount.toLocaleString()}{' '}
                        ({Math.round(progressPercentage)}%)
                      </p>
                    </div>
                  </div>
                  <div className="campaign-card-meta">
                    <p>Donors: {campaign.donors}</p>
                    <p>Days Left: {campaign.daysLeft}</p>
                    <span className={`status-badge ${campaign.status}`}>{campaign.status}</span>
                  </div>
                  <div className="campaign-card-actions">
                    <button
                      onClick={() => handleEditCampaign(campaign)}
                      className="btn btn-primary"
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't created any campaigns yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Transparency Report</h2>
        <div className="report-section">
          <div className="report-item">
            <span>Fund Allocation:</span>
            <p>All funds are transparently tracked and reported monthly</p>
          </div>
          <div className="report-item">
            <span>Impact Metrics:</span>
            <p>Regular impact updates are shared with donors</p>
          </div>
          <button className="btn btn-primary">Download Reports</button>
        </div>
      </div>
    </div>
  )
}

export default NGODashboard
