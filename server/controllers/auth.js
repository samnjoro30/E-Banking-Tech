const { generateOTP, sendOTPEmail } = require('../utils/otp');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');


// Generate account number function
const generateAccountNumber = async () => {
    let accountNumber;
    let user;

    // Ensure uniqueness
    do {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();  // Random 10-digit number
        user = await User.findOne({ accountNumber });
    } while (user);

    return accountNumber;
};

// Custom function to validate password complexity
const isPasswordComplex = (password) => {
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lowercase && uppercase && number && specialChar;
};

// Send confirmation email after registration
const sendConfirmationEmail = (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration Successful',
        text: `Welcome to E-Banking Tech! Your registration was successful. You can now login using your credentials.`
    };

    return transporter.sendMail(mailOptions);
};

const registerUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check password complexity
        if (!isPasswordComplex(password)) {
            return res.status(400).json({
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
            });
        }

        // Password strength validation using zxcvbn
        const passwordStrength = zxcvbn(password);
        if (passwordStrength.score < 3) {  // Adjust score threshold based on your needs
            return res.status(400).json({ message: 'Password is too weak' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate account number
        const accountNumber = await generateAccountNumber();

        // Create new user
        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountNumber,
        });

        await user.save();

        // Generate OTP and send email
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        console.log('OTP generated and saved successfully');

        try {
            await sendOTPEmail(user.email, otp);
            console.log(`OTP email sent to ${user.email}`);
        } catch (error) {
            // If OTP email fails, log the error and rollback OTP
            user.otp = null;
            user.otpExpires = null;
            await user.save();  // Clean up OTP data if sending fails
            console.error('Failed to send OTP email:', error.message);
            return res.status(500).json({ message: 'User registered, but failed to send OTP. Please try again.' });
        }

        // Respond to the client
        res.status(201).json({ message: 'User registered successfully. OTP sent to your email.', userId: user._id });
        res.status(201).json({ message: 'User registered successfully. OTP sent to your email', userId: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// After login, generate OTP and send via email
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const otp = generateOTP();
    await sendOTPEmail(user.email, otp);
    user.otp = otp;  // Save the OTP temporarily in the database
    await user.save();

    res.status(200).json({ message: 'OTP sent to your email', userId: user._id });
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

        // Check if OTP matches and is not expired
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP and its expiration after successful verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};
module.exports = { registerUser, loginUser, verifyOTP };


//303322194273-qpnq0f0c6fb9uhme0gsi4ulpbkogevjb.apps.googleusercontent.com -client id
//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 - secret key