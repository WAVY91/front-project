import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { approveNGO, rejectNGO } from '../store/slices/userSlice'
import { verifyCampaign, rejectCampaign, deleteCampaign } from '../store/slices/campaignSlice'
import Counter from '../components/Counter'
import contactService from '../services/contactService'
import '../styles/Dashboard.css'

const API_URL = 'https://back-project-q78l.onrender.com'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const reduxPendingNGOs = useSelector((state) => state.users.pendingNGOs)
  const reduxNGOs = useSelector((state) => state.users.ngos)
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  const [activeTab, setActiveTab] = useState('ngos')
  const [pendingNGOs, setPendingNGOs] = useState([])
  const [approvedNGOs, setApprovedNGOs] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPendingNGOs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/pending-ngos`)
      const data = await response.json()
      if (data.success) {
        setPendingNGOs(data.data || [])
      }
    } catch {
      setError('Failed to fetch pending NGOs')
      setPendingNGOs(reduxPendingNGOs)
    } finally {
      setLoading(false)
    }
  }, [reduxPendingNGOs])

  const fetchApprovedNGOs = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/all-ngos`)
      const data = await response.json()
      if (data.success) {
        setApprovedNGOs(data.data || [])
      }
    } catch {
      setError('Failed to fetch approved NGOs')
      setApprovedNGOs(reduxNGOs)
    }
  }, [reduxNGOs])

  const fetchContactMessages = useCallback(async () => {
    try {
      const response = await contactService.getAllMessages()
      if (response.data.success) {
        setContactMessages(response.data.data || [])
      }
    } catch {
      setError('Failed to fetch contact messages')
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingNGOs()
      fetchApprovedNGOs()
      fetchContactMessages()

      const refreshInterval = setInterval(() => {
        fetchContactMessages()
      }, 10000)

      return () => clearInterval(refreshInterval)
    }
  }, [user, fetchPendingNGOs, fetchApprovedNGOs, fetchContactMessages])

  const handleMarkAsAttended = async (messageId) => {
    try {
      const response = await contactService.markAsAttended(messageId)
      if (response.data.success) {
        setContactMessages(contactMessages.map(msg => 
          msg._id === messageId ? { ...msg, status: 'attended' } : msg
        ))
      }
    } catch {
      alert('Failed to mark message as attended')
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await contactService.deleteMessage(messageId)
        if (response.data.success) {
          setContactMessages(contactMessages.filter(msg => msg._id !== messageId))
        }
      } catch {
        alert('Failed to delete message')
      }
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="dashboard-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need to be logged in as an admin to access this dashboard.</p>
          <button onClick={() => navigate('/signin')} className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const pendingCampaigns = campaigns.filter((c) => c.status === 'pending')
  const rejectedCampaigns = campaigns.filter((c) => c.status === 'rejected')

  const handleApproveNGO = async (ngoId) => {
    try {
      const response = await fetch(`${API_URL}/admin/approve-ngo/${ngoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch(approveNGO(ngoId))
        setPendingNGOs(pendingNGOs.filter(ngo => ngo._id !== ngoId))
        fetchApprovedNGOs()
      }
    } catch {
      alert('Failed to approve NGO')
    }
  }

  const handleRejectNGO = async (ngoId) => {
    try {
      const response = await fetch(`${API_URL}/admin/reject-ngo/${ngoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch(rejectNGO(ngoId))
        setPendingNGOs(pendingNGOs.filter(ngo => ngo._id !== ngoId))
      }
    } catch {
      alert('Failed to reject NGO')
    }
  }

  const handleVerifyCampaign = async (id) => {
    try {
      const response = await fetch(`${API_URL}/campaign/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch(verifyCampaign(id))
      } else {
        alert('Failed to approve campaign')
      }
    } catch (error) {
      console.error('Error approving campaign:', error)
      dispatch(verifyCampaign(id))
    }
  }

  const handleRejectCampaign = async (id) => {
    try {
      const response = await fetch(`${API_URL}/campaign/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch(rejectCampaign(id))
      } else {
        alert('Failed to reject campaign')
      }
    } catch (error) {
      console.error('Error rejecting campaign:', error)
      dispatch(rejectCampaign(id))
    }
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
          <h1>Admin Dashboard</h1>
          <p>Manage verifications and approvals</p>
        </div>
        <button onClick={() => { dispatch(logout()); navigate('/'); }} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <h3>Verified NGOs</h3>
          <p className="stat-value">
            <Counter target={approvedNGOs.length} duration={2000} />
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <h3>Pending NGOs</h3>
          <p className="stat-value">
            <Counter target={pendingNGOs.length} duration={2000} />
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <h3>Active Campaigns</h3>
          <p className="stat-value">
            <Counter target={campaigns.filter((c) => c.status === 'active' || c.status === 'approved').length} duration={2000} />
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <h3>Contact Messages</h3>
          <p className="stat-value">
            <Counter 
              target={contactMessages.length} 
              duration={1500} 
            />
          </p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'ngos' ? 'active' : ''}`}
          onClick={() => setActiveTab('ngos')}
        >
          NGO Verification
        </button>
        <button
          className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaign Verification
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved NGOs
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved-campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved-campaigns')}
        >
          Approved Campaigns
        </button>
        <button
          className={`tab-btn ${activeTab === 'rejected-campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected-campaigns')}
        >
          Rejected Campaigns
        </button>
        <button
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Contact Messages
        </button>
      </div>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>{error}</div>}

      {activeTab === 'ngos' && (
        <div className="dashboard-section">
          <h2>Pending NGO Applications</h2>
          {loading ? (
            <p>Loading...</p>
          ) : pendingNGOs.length > 0 ? (
            <div className="admin-list">
              {pendingNGOs.map((ngo) => (
                <div key={ngo._id} className="admin-item">
                  <div className="admin-item-info">
                    <h3>{ngo.ngoName}</h3>
                    <p className="admin-email">Contact: {ngo.name}</p>
                    <p className="admin-email">{ngo.email}</p>
                    <p className="admin-description">{ngo.ngoDescription}</p>
                    <p className="admin-doc">Status: {ngo.status}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      onClick={() => handleApproveNGO(ngo._id)}
                      className="btn btn-success"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleRejectNGO(ngo._id)}
                      className="btn btn-danger"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending NGO applications</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="dashboard-section">
          <h2>Pending Campaign Verification</h2>
          {pendingCampaigns.length > 0 ? (
            <div className="admin-list">
              {pendingCampaigns.map((campaign) => (
                <div key={campaign.id} className="admin-item">
                  <div className="admin-item-info">
                    <h3>{campaign.title}</h3>
                    <p className="admin-ngo">NGO: {campaign.ngoName}</p>
                    <p className="admin-description">{campaign.description}</p>
                    <p className="admin-goal">Goal: ₦{campaign.goalAmount.toLocaleString()}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      onClick={() => handleVerifyCampaign(campaign.id)}
                      className="btn btn-success"
                    >
                      ✓ Verify
                    </button>
                    <button
                      onClick={() => handleRejectCampaign(campaign.id)}
                      className="btn btn-danger"
                    >
                      ✕ Reject
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending campaigns</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="dashboard-section">
          <h2>Approved NGOs</h2>
          {approvedNGOs.length > 0 ? (
            <div className="approved-grid">
              {approvedNGOs.map((ngo) => (
                <div key={ngo._id} className="approved-card">
                  <div className="approved-badge">✓ Verified</div>
                  <h3>{ngo.ngoName}</h3>
                  <p className="approved-email">{ngo.email}</p>
                  <p className="approved-desc">{ngo.ngoDescription}</p>
                  <p className="approved-status">Status: {ngo.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No approved NGOs yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approved-campaigns' && (
        <div className="dashboard-section">
          <h2>Approved Campaigns</h2>
          {campaigns.filter((c) => c.status === 'active' || c.status === 'approved' || c.verified).length > 0 ? (
            <div className="admin-list">
              {campaigns.filter((c) => c.status === 'active' || c.status === 'approved' || c.verified).map((campaign) => (
                <div key={campaign.id} className="admin-item">
                  <div className="admin-item-info">
                    <h3>{campaign.title}</h3>
                    <p className="admin-ngo">NGO: {campaign.ngoName}</p>
                    <p className="admin-description">{campaign.description}</p>
                    <p className="admin-goal">Goal: ₦{campaign.goalAmount.toLocaleString()}</p>
                    <p className="admin-raised">Raised: ₦{campaign.raisedAmount.toLocaleString()} ({Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%)</p>
                    <p className="admin-doc">Status: <span className={`status-badge ${campaign.status}`}>{campaign.status}</span></p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No approved campaigns yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rejected-campaigns' && (
        <div className="dashboard-section">
          <h2>Rejected Campaigns</h2>
          {rejectedCampaigns.length > 0 ? (
            <div className="admin-list">
              {rejectedCampaigns.map((campaign) => (
                <div key={campaign.id} className="admin-item">
                  <div className="admin-item-info">
                    <h3>{campaign.title}</h3>
                    <p className="admin-ngo">NGO: {campaign.ngoName}</p>
                    <p className="admin-description">{campaign.description}</p>
                    <p className="admin-goal">Goal: ₦{campaign.goalAmount.toLocaleString()}</p>
                    <p className="admin-doc">Status: <span className={`status-badge ${campaign.status}`}>{campaign.status}</span></p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No rejected campaigns</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="dashboard-section">
          <h2>Contact Messages</h2>
          {contactMessages.length > 0 ? (
            <div className="admin-list">
              {contactMessages.map((message) => (
                <div key={message._id} className="admin-item">
                  <div className="admin-item-info">
                    <h3>{message.subject}</h3>
                    <p className="admin-email"><strong>From:</strong> {message.name} ({message.email})</p>
                    <p className="admin-description">{message.message}</p>
                    <p className="admin-doc">
                      <strong>Status:</strong> 
                      <span className={`status-badge ${message.status}`}>
                        {message.status === 'unattended' ? '⏳ Unattended' : '✓ Attended'}
                      </span>
                    </p>
                    <p className="admin-doc"><small>Received: {new Date(message.createdAt).toLocaleString()}</small></p>
                  </div>
                  <div className="admin-item-actions">
                    {message.status === 'unattended' && (
                      <button
                        onClick={() => handleMarkAsAttended(message._id)}
                        className="btn btn-success"
                      >
                        ✓ Mark Attended
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No contact messages yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
