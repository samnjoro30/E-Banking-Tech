// src/components/CreditCard.js
import React, { useState } from 'react';
import './CreditCard.css'; // Import the CSS for styling

const CreditCard = ({ cardNumber, cardHolder, expiryDate, cvv }) => {
    const [isFlipped, setIsFlipped] = useState(false); // State to manage rotation

    const handleMouseEnter = () => {
        setIsFlipped(true);
    };

    const handleMouseLeave = () => {
        setIsFlipped(false);
    };

    return (
        <div 
            className={`credit-card ${isFlipped ? 'flipped' : ''}`} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <div className="credit-card-inner">
                <div className="credit-card-front">
                    <h2 className="card-title">Credit Card</h2>
                    <p className="card-number">Card number: {cardNumber}</p>
                    <p className="card-holder">{cardHolder}</p>
                    <p className="expiry-date">Expires: {expiryDate}</p>
                </div> 
                <div className="credit-card-back">
                    <div className="strip"></div>
                    <p className="cvv">CVV: {cvv}</p>
                    <p className="card-number">Card number: {cardNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
