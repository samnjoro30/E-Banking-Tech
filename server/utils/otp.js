const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
require('dotenv').config();

// Check for email configuration in environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Missing email configuration in environment variables.');
}

// Create transporter with basic authentication
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send OTP email
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'E-Banking Tech - OTP Verification',
    html: `
            <p>Dear User,</p>
            <p>Your OTP code is: <strong>${otp}</strong>.</p>
            <p>Please use this code to complete your authentication. The code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Best regards,<br>E-Banking Tech Team</p>
        `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('Failed to send OTP email.');
  }
};


const generateOTP = () => {
  return speakeasy.totp({
    secret: process.env.OTP_SECRET || 'mysecret',
    encoding: 'base32',
    digits: 6,
    step: parseInt(process.env.OTP_EXPIRY_SECONDS, 10) || 300 
  });
};

module.exports = { sendOTPEmail, generateOTP };

