const express = require('express');
const {
  registerUser,
  loginUser,
  verifyOTP,
  resetPassword,
  forgotPassword,
  refreshAccessToken,
  logout,
} = require('../controllers/auth');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authMiddleware, logout);
router.post('/verify-otp', verifyOTP);
// Add validation in the route
router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 6 characters long'),
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
  ],
  registerUser
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
