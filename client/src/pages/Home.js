import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Assuming you're adding custom CSS for styling
import bankVideo from '../images/Bank2.mp4'; 
import Footer from '../components/footer';
import App from '../components/dark';

const Home = () => {
    return (
        <div className="home-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1 className="brand-name">E-Banking</h1>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/">Services</Link></li>
                    <li><Link to="/">About</Link></li>
                    <li><Link to="/">Contact</Link></li>
                    {/* Update these links to point to the /auth route */}
                    <li><Link to="/auth">Login</Link></li>
                    <li><Link to="/auth">Register</Link></li>
                </ul>
            </nav>
            <div>
                <App />
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h2>Welcome to E-Banking</h2>
                    <p>Your financial partner, anywhere, anytime.</p>
                    {/* Update the button to route to the Auth component */}
                    <Link to="/auth" className="cta-button">Get Started</Link>
                </div>
                <div className="hero-architecture">
                    {/* Illustration of Bank Architecture */}
                    <h3>Bank Architecture</h3>
                    <video autoPlay muted loop>
                        <source src={bankVideo} type="video/mp4" />
                    </video>
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
            <div>
                < Footer/>
            </div>

        </div>
    );
};

export default Home;
