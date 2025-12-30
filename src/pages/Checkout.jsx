import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addDonation, clearCurrentDonation } from '../store/slices/donationSlice'
import { updateCampaignFunding } from '../store/slices/campaignSlice'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import donationService from '../services/donationService'
import '../styles/Checkout.css'

const paymentSchema = Yup.object().shape({
  cardName: Yup.string().required('Name on card is required'),
  cardNumber: Yup.string()
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry: Yup.string()
    .required('Expiry date is required')
    .matches(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: Yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
})

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const donation = useSelector((state) => state.donations.currentDonation)
  const user = useSelector((state) => state.auth.user)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!donation) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>No donation in progress</h2>
          <p>Select a campaign to make a donation</p>
          <button onClick={() => navigate('/campaigns')} className="btn btn-primary">
            View Campaigns
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (values) => {
    setIsProcessing(true)
    setErrorMessage('')

    setTimeout(async () => {
      try {
        // Use MongoDB _id as campaignId
        const campaignId = donation._id || donation.campaignId
        const donorId = user?._id || user?.id
        
        // Fallback values if not set
        const donorName = donation.donorName || user?.name || user?.email || 'Anonymous Donor'
        const donorEmail = donation.donorEmail || user?.email || ''
        const ngoName = donation.ngoName || 'Organization'
        const campaignTitle = donation.campaignTitle || 'Campaign'
        
        console.log('Donation submission:', {
          campaignId,
          donorId,
          amount: donation.amount,
          donorName,
          donorEmail,
          ngoName,
        })

        if (!campaignId) {
          throw new Error('Campaign ID is missing')
        }
        if (!donorId) {
          throw new Error('You must be logged in to donate')
        }
        if (!donorEmail) {
          throw new Error('Donor email is required')
        }

        const donationData = {
          campaignId: campaignId,
          donorId: donorId,
          amount: Number(donation.amount),
          campaignTitle: campaignTitle,
          donorName: donorName,
          donorEmail: donorEmail,
          ngoName: ngoName,
          isAnonymous: donation.isAnonymous || false,
          paymentMethod: 'card',
          cardLast4: values.cardNumber.slice(-4),
          status: 'completed',
        }

        console.log('Final donation data being sent:', donationData)

        // Submit donation to backend
        const response = await donationService.submitDonation(donationData)
        console.log('Donation response:', response.data)

        setIsProcessing(false)
        setPaymentSuccess(true)

        dispatch(
          addDonation({
            campaignId: campaignId,
            campaignTitle: donation.campaignTitle,
            amount: donation.amount,
            donorName: donation.donorName,
            donorEmail: donation.donorEmail,
            ngoName: donation.ngoName,
            paymentMethod: 'card',
            cardLast4: values.cardNumber.slice(-4),
          })
        )

        dispatch(
          updateCampaignFunding({
            campaignId: campaignId,
            amount: donation.amount,
          })
        )

        setTimeout(() => {
          dispatch(clearCurrentDonation())
          navigate('/donor-dashboard')
        }, 2000)
      } catch (error) {
        setIsProcessing(false)
        const errorMsg = error.response?.data?.message || error.message || 'Failed to process donation. Please try again.'
        setErrorMessage(errorMsg)
        console.error('Donation submission error:', error)
      }
    }, 2000)
  }

  if (paymentSuccess) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your generous donation of ₦{donation.amount.toLocaleString()}</p>
          <p className="success-detail">A confirmation email has been sent to {donation.donorEmail || 'your email'} and to the NGO</p>
          <p className="redirect-message">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-main">
          <h1>Complete Your Donation</h1>

          {errorMessage && (
            <div className="error-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px' }}>
              {errorMessage}
            </div>
          )}

          <div className="order-summary">
            <div className="summary-item">
              <span>Campaign:</span>
              <strong>{donation.campaignTitle}</strong>
            </div>
            <div className="summary-item">
              <span>Organization:</span>
              <strong>{donation.ngoName}</strong>
            </div>
            <div className="summary-item">
              <span>Donor:</span>
              <strong>{donation.donorName}</strong>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span>Total Amount:</span>
              <strong>₦{donation.amount.toLocaleString()}</strong>
            </div>
          </div>

          <Formik
            initialValues={{
              cardName: '',
              cardNumber: '',
              expiry: '',
              cvv: '',
            }}
            validationSchema={paymentSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="payment-form">
                <fieldset>
                  <legend>Card Details</legend>

                  <div className="form-group">
                    <label>Name on Card</label>
                    <Field name="cardName" type="text" placeholder="John Doe" />
                    <ErrorMessage name="cardName" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
                    <Field name="cardNumber" type="text" placeholder="1234 5678 9012 3456" maxLength="16" />
                    <ErrorMessage name="cardNumber" component="span" className="error" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <Field name="expiry" type="text" placeholder="MM/YY" maxLength="5" />
                      <ErrorMessage name="expiry" component="span" className="error" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <Field name="cvv" type="text" placeholder="123" maxLength="4" />
                      <ErrorMessage name="cvv" component="span" className="error" />
                    </div>
                  </div>
                </fieldset>

                <div className="security-info">
                  <span>🔒</span> Your payment information is secure and encrypted
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₦${donation.amount.toLocaleString()}`}
                </button>
              </Form>
            )}
          </Formik>

          <div className="demo-info">
            <p><strong>Demo Card for Testing:</strong></p>
            <p>Card: 4111 1111 1111 1111</p>
            <p>Any expiry date and CVV (3 digits)</p>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="sidebar-card">
            <h3>Donation Impact</h3>
            <div className="impact-item">
              <span>Your Amount:</span>
              <strong>₦{donation.amount.toLocaleString()}</strong>
            </div>
            <div className="impact-text">
              Every rupee you donate directly supports {donation.ngoName} in creating lasting impact.
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Why Donate?</h3>
            <ul>
              <li>✓ Verified and transparent NGOs</li>
              <li>✓ Real-time impact tracking</li>
              <li>✓ Tax-deductible donation</li>
              <li>✓ Monthly impact reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
