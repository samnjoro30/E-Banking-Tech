import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'// Assuming you're adding custom CSS for styling

const Home = () => {
    return (
        <div className="home-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1 className="brand-name">E-Banking</h1>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h2>Welcome to E-Banking</h2>
                    <p>Your financial partner, anywhere, anytime.</p>
                    <Link to="/register" className="cta-button">Get Started</Link>
                </div>
                <div className="hero-architecture">
                    {/* Illustration of Bank Architecture */}
                    <h3>Bank Architecture</h3>
                    <img src="bank-architecture.png" alt="Bank Architecture" className="architecture-image" />
                    <p>This is how we structure our digital banking services for seamless customer experience.</p>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <h3>Our Services</h3>
                <div className="service-cards">
                    <div className="service-card">
                        <h4>Savings Accounts</h4>
                        <p>Open a savings account and enjoy attractive interest rates and flexible access to your funds.</p>
                    </div>
                    <div className="service-card">
                        <h4>Loans</h4>
                        <p>Get personal, home, and business loans at competitive interest rates with easy repayment options.</p>
                    </div>
                    <div className="service-card">
                        <h4>Credit Cards</h4>
                        <p>Choose from our range of credit cards that offer rewards, cashback, and more.</p>
                    </div>
                    <div className="service-card">
                        <h4>Investments</h4>
                        <p>Grow your wealth with our investment plans that are tailored to meet your financial goals.</p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <p>&copy; 2024 E-Banking | All rights reserved.</p>
                <ul className="social-links">
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">LinkedIn</a></li>
                </ul>
            </footer>
        </div>
    );
};

export default Home;