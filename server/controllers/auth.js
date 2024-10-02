const { generateOTP, sendOTPEmail } = require('../utils/otp');
const jwt = require('../utils/jwt');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const jwtr = require('jsonwebtoken');


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
        const token = jwt.generateToken(newUser);
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
        res.status(201).json({ message: 'User registered successfully. OTP sent to your email.', userId: user._id }, { token });
        res.status(201).json({ message: 'User registered successfully. OTP sent to your email', userId: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// After login, generate OTP and send via email
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const token = jwtr.sign(
            { userId: user._id, firstName: user.firstName, lastName: user.lastName, accountNumber: user.accountNumber },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // '1h', '7d', etc.
        );

        // Return token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { firstName: user.firstName, lastName: user.lastName, accountNumber: user.accountNumber }
        });

       
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
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
/*const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Access user ID from req.user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};*/
const getDashboardData = async (req, res) => {
    try {
        const user = req.user; // Assuming you're using middleware to attach user from the token
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountNumber: user.accountNumber,
            balance: user.balance // Assuming you have a balance property
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { registerUser, loginUser, verifyOTP, getDashboardData};
