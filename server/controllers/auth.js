const { generateOTP, sendOTPEmail } = require('../utils/otp');
const refreshTokenModel = require('../models/refreshToken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const { AuthRegisterValidation } = require('../validation/auth.validate');
const { formatValidateErrors } = require('../utils/format.utils');
const { hashPassword } = require('../services/auth.service');
const { Cookie } = require('../utils/cookie');
const jwtr = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');
const logger = require('../config/logger');
require('dotenv').config();

const isPasswordComplex = password => {
  const lowercase = /[a-z]/.test(password);
  const uppercase = /[A-Z]/.test(password);
  const number = /\d/.test(password);
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return lowercase && uppercase && number && specialChar;
};

const registerUser = async (req, res, next) => {
  try {
    const validatedData = AuthRegisterValidation.parse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidateErrors(validatedData.error),
      });
    }

    const { email, password, firstName, lastName, gender, phoneNumber } =
      validatedData.data;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!isPasswordComplex(password)) {
      return res.status(400).json({
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
      });
    }

    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({ message: 'Password is too weak' });
    }

    const hashedPassword = hashPassword(password);

    const otp = generateOTP();
    const otpExpires =
      Date.now() + (parseInt(process.env.OTP_EXPIRY_SECONDS, 10) || 300) * 1000;
    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      phoneNumber,
      balance: 0,
      isVerified: false,
      otp,
      otpExpires,
    });

    await user.save();
    const token = generateToken.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    Cookie.set(res, 'token', token);
    logger.info(`User registered: ${email}`);
    res.status(201).json({
      massage:
        'User registered successfully. Please verify your email with the OTP sent.',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    logger.error('Registration error:', err);
    if (err.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }
    next(err);
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// After login, generate OTP and send via email
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const accessToken = jwtr.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwtr.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    await refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({
      message: 'Login successful',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: 'Missing refresh token' });

  try {
    const storedToken = await refreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!storedToken)
      return res.status(403).json({ message: 'Invalid refresh token' });

    jwtr.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).json({ message: 'Expired refresh token' });

        const payload = { userId: decoded.userId, email: decoded.email };

        // Generate new access token
        const newAccessToken = jwtr.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '15m',
        });

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });

        return res.json({ message: 'Access token refreshed' });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
//logout
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    await refreshTokenModel.deleteOne({ token: refreshToken });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error during logout:', err);
    return res.status(500).json({
      message: 'Error logging out',
    });
  }
};
// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  // Validate OTP
  try {
    // Fetch user from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log('Received OTP:', otp);
    console.log('Stored OTP:', user.otp);
    console.log('OTP Expiration:', new Date(user.otpExpires));
    console.log('Current Time:', new Date());

    // Check if OTP matches and is not expired
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP and its expiration after successful verification
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    try {
      // await sendConfirmationEmail(user.email);
      console.log(`Confirmation email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error.message);
      return res.status(500).json({
        message: 'OTP verified, but failed to send confirmation email.',
      });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'there is an error verifying OTP' });
    console.log('backend error', err.message);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    await sendOTPEmail(user.email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const changeEmail = async (req, res) => {
  const { email, newEmail } = req.body;
  if (!email || !newEmail) {
    return res.status(400).json({
      message: 'both email fields are required',
    });
  }
  if (email === newEmail) {
    return res.status(400).json({
      message: 'New email must be different from the old email',
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'email not found',
      });
    }
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({
        message: 'new email exists',
      });
    }

    user.email = newEmail;
    await user.save();

    return res.status(200).json({
      message: 'Email updated succesfully',
      newEmail,
    });
  } catch (err) {
    console.error('Error changing email:', err);
    return res.status(500).json({
      message: 'Server Error, email could not be updated',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyOTP,
  resetPassword,
  forgotPassword,
  changeEmail,
  logout,
};
