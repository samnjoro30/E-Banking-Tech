import React, { useState } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscription = async e => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Subscribed with email: ${email}`);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebookF />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <FaLinkedinIn />, url: 'https://linkedin.com' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Support', path: '/support' },
  ];

  const paymentMethods = [
    'Visa',
    'Mastercard',
    'PayPal',
    'Apple Pay',
    'Google Pay',
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section footer-brand">
          <div className="footer-logo">E-Payment</div>
          <p className="footer-tagline">
            Bringing convenience to your doorstep. Making payments fast and
            secure.
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>E-Banking Tech, Nairobi</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+254 799 169 720</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>support@epayment.com</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.slice(0, 4).map((link, index) => (
              <li key={index}>
                <a href={link.path} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            {quickLinks.slice(4).map((link, index) => (
              <li key={index}>
                <a href={link.path} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-text">
            Stay updated with our latest features and offers.
          </p>

          {subscribed ? (
            <div className="subscription-success">
              <div className="success-icon">✓</div>
              <p>Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscription} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <p className="form-note">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            &copy; {year} E-Payment Platform Inc. All rights reserved.
          </div>

          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="payment-methods">
            <span className="payment-label">Accepted Payments:</span>
            <div className="payment-icons">
              {paymentMethods.map((method, index) => (
                <span key={index} className="payment-method">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
