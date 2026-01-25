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
const { verifyCsrf } = require('../utils/csrf');
const router = express.Router();

router.post('/login', loginUser);
router.post('/refresh-token', verifyCsrf, refreshAccessToken);
router.post('/logout', authMiddleware, logout);
router.post('/verify-otp', verifyCsrf, verifyOTP);
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
  verifyCsrf,
  registerUser
);
router.post('/forgot-password', verifyCsrf, forgotPassword);
router.post('/reset-password', verifyCsrf, resetPassword);

module.exports = router;
