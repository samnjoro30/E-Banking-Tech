import React, {useState} from 'react';

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());
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

    // Social media icons (you would typically add links/icons for these)
    const socialLinks = [
        { name: 'Facebook', url: 'https://facebook.com' },
        { name: 'Twitter', url: 'https://twitter.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Instagram', url: 'https://instagram.com' },
    ];

    return (
        <footer style={styles.footerContainer}>
            <div style={styles.footerContent}>
                {/* Section 1: Company Information */}
                <div style={styles.section}>
                    <h4>About Us</h4>
                    <p>E-Banking Tech, Nairobi</p>
                    <p>Email: info@ebanking.com</p>
                    <p>Phone: +254 799169720</p>
                </div>

                {/* Section 2: Navigation Links */}
                <div style={styles.section}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/home">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                </div>

                {/* Section 3: Social Media Links */}
                <div style={styles.section}>
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

               
                <div style={styles.section}>
                    <h4>Newsletter</h4>
                    {renderSubscriptionMessage()}
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div style={styles.footerBottom}>
                <p>&copy; {year} E-Banking Tech Inc. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

// Inline CSS styles for simple styling
const styles = {
    footerContainer: {
        backgroundColor: 'black',
        color: '#fff',
        padding: '40px 20px',
        textAlign: 'center',
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
    },
    section: {
        flex: '1 1 200px',
        margin: '10px',
    },
    footerBottom: {
        marginTop: '20px',
        borderTop: '1px solid #444',
        paddingTop: '10px',
    },
};


export default Footer;
