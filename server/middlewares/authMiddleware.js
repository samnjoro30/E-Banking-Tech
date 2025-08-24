const jwt = require('../utils/jwt');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
    const token = authHeader?.split(' ')[1].replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verifyToken(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = user; 
        next(); 
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports =  authMiddleware ;
