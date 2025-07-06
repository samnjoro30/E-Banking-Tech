import React, { useState } from 'react';
import '../styles/footer.css';

const Footer = () => {
    const [year] = useState(new Date().getFullYear());
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubscription = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            console.log(`Subscribed with email: ${email}`);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const renderSubscriptionMessage = () => {
        return subscribed ? (
            <p>Thank you for subscribing!</p>
        ) : (
            <form onSubmit={handleSubscription}>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Subscribe</button>
            </form>
        );
    };

    const socialLinks = [
        { name: 'Facebook', url: 'https://facebook.com' },
        { name: 'Twitter', url: 'https://twitter.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Instagram', url: 'https://instagram.com' },
    ];

    return (
        <footer className="footerContainer">
            <div className='footerContent'>
                <div className='section'>
                    <h4>About Us</h4>
                    <p>E-Banking Tech, Nairobi</p>
                    <p>Email: info@ebanking.com</p>
                    <p>Phone: +254 799169720</p>
                </div>

                <div className='section'>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/home">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                </div>

                <div className='section'>
                    <h4>Follow Us</h4>
                    <ul>
                        {socialLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='section'>
                    <h4>Newsletter</h4>
                    {renderSubscriptionMessage()}
                </div>
            </div>

            <div className='footerBottom'>
                <p>&copy; {year} E-Banking Tech Inc. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
