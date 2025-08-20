import React from 'react';
// import '../styles/footerdash.css';

const FooterDash = () => {
    const currentYear = new Date().getFullYear();


    return(
        <footer className="footer-dash">
            &copy; {currentYear} E-Banking. All rights reserved.
        </footer>
    )

}

export default FooterDash;