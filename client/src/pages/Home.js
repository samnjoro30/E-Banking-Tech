import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import bankArchImg from '../images/bank.jpeg'; // new image
import Footer from '../components/footer';
import Header1 from '../components/header1';

const Home = () => {
    return (
        <div className="">
            <div className="header">
                <Header1 />
                
            </div>
            <section className="hero">
                <div className="hero-inner">
                    <h1 className="hero-title">
                       Your All-In-One <span>Digital Finance Hub</span>
                    </h1>
                    <p className="hero-description">
                        Secure payments, smart analytics, seamless transfers — enjoy banking 
                        designed for speed, safety, and simplicity.
                    </p>

                    <Link to="/auth" className="hero-btn">Get Started</Link>
                </div>
            </section>

      <section className="why-section">
        <div className="why-content">
          <h2>
            Why Choose Our <span>Digital Banking Solutions?</span>
          </h2>
          <p className="why-description">
            We provide enterprise-grade security and intelligent money-management 
            tools to keep your financial life convenient and safe.
          </p>

          <ul className="why-list">
            <li>✓ Bank-Level Security & Encryption</li>
            <li>✓ AI-Powered Fraud Detection</li>
            <li>✓ Real-Time Financial Insights</li>
            <li>✓ 24/7 Customer Support</li>
          </ul>
        </div>

        <div className="why-image">
          <img src={bankArchImg} alt="digital banking" />
        </div>
      </section>

      <section className="services">
        <h3>Our Core Services</h3>

        <div className="service-grid">

          <div className="service-card">
            <div className="icon-circle">💼</div>
            <h4>Smart Wallet</h4>
            <p>Secure, fast & intelligent wallet for managing your funds.</p>
          </div>


          <div className="service-card">
            <div className="icon-circle">💸</div>
            <h4>Instant Loans</h4>
            <p>Quick approvals with transparent pricing.</p>
          </div>

          <div className="service-card">
            <div className="icon-circle">📱</div>
            <h4>Bills & Airtime</h4>
            <p>Pay bills and buy airtime or data instantly.</p>
          </div>

          <div className="service-card">
            <div className="icon-circle">🔁</div>
            <h4>Send & Receive</h4>
            <p>Transfer securely to any bank or wallet worldwide.</p>
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>1M+</h2>
          <p>Active Users</p>
        </div>
        <div className="stat-box">
          <h2>$500M+</h2>
          <p>Monthly Transactions</p>
        </div>
        <div className="stat-box">
          <h2>97%</h2>
          <p>User Satisfaction</p>
        </div>
      </section>

      <section className="testimonials">
        <h3>What Users Say</h3>

        <div className="testimonial-grid">
          <div className="testimonial">
            <p>“Super secure, super fast. My favorite payment platform!”</p>
            <h4>— Sarah</h4>
          </div>
          <div className="testimonial">
            <p>“The best UI/UX I’ve seen in a digital banking app.”</p>
            <h4>— Daniel</h4>
          </div>
          <div className="testimonial">
            <p>“Transfers are instant, and the support team is amazing.”</p>
            <h4>— Olivia</h4>
          </div>
        </div>
      </section>

            <Footer />
        </div>
    );
};

export default Home;
