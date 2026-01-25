import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AdminSignup from './pages/AdminSignup'
import Campaign from './pages/Campaign'
import CampaignDetail from './pages/CampaignDetail'
import Checkout from './pages/Checkout'
import DonorDashboard from './pages/DonorDashboard'
import NGODashboard from './pages/NGODashboard'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Impact from './pages/Impart'
import Transparency from './pages/Transparency'
import HowItWorks from './pages/HowItWorks'
import Support from './pages/Support'
import Verification from './pages/Verification'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/admin-signup' element={<AdminSignup />} />
        <Route path='/campaigns' element={<Campaign />} />
        <Route path='/campaign/:id' element={<CampaignDetail />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/donor-dashboard' element={<ProtectedRoute requiredRole="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path='/ngo-dashboard' element={<ProtectedRoute requiredRole="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path='/admin-dashboard' element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/impact' element={<Impact />} />
        <Route path='/transparency' element={<Transparency />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/support' element={<Support />} />
        <Route path='/verification' element={<Verification />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App