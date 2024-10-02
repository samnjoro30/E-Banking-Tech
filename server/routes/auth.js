const express = require('express');
const { registerUser, loginUser, verifyOTP, /*getUserProfile,*/ getDashboardData } = require('../controllers/auth');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.get('/dashboard', authMiddleware, getDashboardData);
// Add validation in the route
router.post('/register', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required')
], registerUser);


module.exports = router;

