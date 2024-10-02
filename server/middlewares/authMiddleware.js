const jwt = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verifyToken(token);
    
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};



module.exports =  authMiddleware ;
