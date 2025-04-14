import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import bankArchImg from '../images/bank.jpeg'; // new image
import Footer from '../components/footer';
import Header from '../components/header1';

const Home = () => {
    return (
        <div className="home-page">
            <div className="header">
                <Header />
            </div>
            <section className="ebanking-section">
                <div className="ebanking-content">
                    <h2 className="title">
                      WHY CHOOSE OUR <br /> DIGITAL BANKING SOLUTIONS
                    </h2>
                    <p className="description">
                       Our E-Banking platform is designed to keep your financial life seamless and secure. Enjoy 24/7 access, advanced fraud protection, and tools that empower smarter money management.
                    </p>

                    <ul className="features-list">
                        <li>✔️ Real-Time Account Monitoring</li>
                        <li>✔️ AI-Powered Fraud Detection</li>
                        <li>✔️ Personalized Financial Insights</li>
                        <li>✔️ 24/7 Customer Support & Chatbot</li>
                    </ul>

                    <a href="/auth" className="cta-link">
                        Open an Account
                    </a>
                </div>

                <div className="ebanking-image">
                    <img 
                        src={bankArchImg} 
                        alt="Digital Banking Team" 
                        
                        loading="lazy"
                    /> 
                </div>
            </section>

            {/* SERVICES */}
            <section className="services-section">
                <h3>Our Services</h3>
                <div className="service-cards">
                    <div className="service-card">
                        <h4>Savings Accounts</h4>
                        <p>Grow your savings with competitive rates and easy access anytime.</p>
                    </div>
                    <div className="service-card">
                        <h4>Loans</h4>
                        <p>Flexible personal, home, and business loans tailored for your needs.</p>
                    </div>
                    <div className="service-card">
                        <h4>Credit Cards</h4>
                        <p>Access exclusive benefits with our secure and rewarding credit cards.</p>
                    </div>
                    <div className="service-card">
                        <h4>Investments</h4>
                        <p>Secure your future with personalized investment plans.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
