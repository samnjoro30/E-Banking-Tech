const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, accountNumber: user.accountNumber },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } // 1 hour or as per .env config
    );
};

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid Token');
    }
};

module.exports = { generateToken, verifyToken };

