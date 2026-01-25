import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Footer.css'

const Footer = () => {
    return (
    <footer className="footer">
        <div className="footer-container">
        <div className="footer-section">
            <div className="footer-logo">
            <span className="logo-icon">🏥</span>
            <h3>Good Health</h3>
            </div>
            <p className="footer-description">
            Connecting compassionate donors with verified NGOs to create meaningful change. We believe in the power of collective action to transform lives and build healthier, more sustainable communities worldwide.
            </p>
            <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">in</a>
            </div>
        </div>

        <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/campaigns">All Campaigns</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            </ul>
        </div>

        <div className="footer-section">
            <h4>Campaign Categories</h4>
            <ul>
            <li>Healthcare & Medical</li>
            <li>Food & Nutrition</li>
            <li>Education & Skills</li>
            <li>Housing & Shelter</li>
            <li>Disaster Relief</li>
            <li>Environmental</li>
            </ul>
        </div>

        <div className="footer-section">
            <h4>For NGOs</h4>
            <ul>
            <li><Link to="/signup">Register Your NGO</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/support">Get Support</Link></li>
            <li><Link to="/verification">Verification Process</Link></li>
            </ul>
        </div>

        <div className="footer-section">
            <h4>For Donors</h4>
            <ul>
            <li><Link to="/campaigns">Browse Campaigns</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/impact">Track Impact</Link></li>
            <li><Link to="/transparency">Transparency Reports</Link></li>
            </ul>
        </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
        <div className="footer-bottom-content">
            <p>&copy; 2024 Good Health. All rights reserved.</p>
            <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="divider">•</span>
            <a href="#cookies">Cookie Policy</a>
            </div>
        </div>
        <div className="footer-mission">
            <p><strong>Our Mission:</strong> Democratizing philanthropy by connecting everyday donors with verified NGOs doing extraordinary work in healthcare, education, food security, housing, and humanitarian causes.</p>
        </div>
        </div>
    </footer>
    )
}

export default Footer
