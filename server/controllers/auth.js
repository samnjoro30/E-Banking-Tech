const { generateOTP, sendOTPEmail } = require('../utils/otp');
const jwt = require('../utils/jwt');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const jwtr = require('jsonwebtoken');
require('dotenv').config();



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

//testing
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
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
const generateCardNumber = () => {
    let cardNumber = '4'; // Starting with '4' for Visa (change this for other types)
    for (let i = 0; i < 15; i++) {
        cardNumber += Math.floor(Math.random() * 10); // Append random digits
    }
    return cardNumber;
};
const generateExpiryDate = () => {
    const currentYear = new Date().getFullYear();
    const year = currentYear + Math.floor(Math.random() * 5 + 1); // Random year between now and 5 years later
    const month = ('0' + Math.floor(Math.random() * 12 + 1)).slice(-2); // Random month
    return `${month}/${year.toString().slice(-2)}`; // Format MM/YY
};

// Function to generate a CVV
const generateCVV = () => {
    let cvv = '';
    for (let i = 0; i < 3; i++) {
        cvv += Math.floor(Math.random() * 10); // Append random digits
    }
    return cvv;
}; 
/*const creditCard = async (req, res) =>{
    setTimeout(() => {
        const cardDetails = {
            cardNumber: generateCardNumber(),
            cvv: generateCVV(),
            expiryDate: generateExpiryDate(), // You can generate a dynamic expiry date if needed
            cardHolder: `${firstName} ${lastName}` || 'John Doe' // or take this from the user input
        };
        res.json(cardDetails);
    }, 3000);
};*/
const registerUser = async (req, res) => {
    const { email, password, firstName, lastName, pin, gender, dob, phoneNumber } = req.body;

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
        // Validate the PIN to ensure it's a 5-digit number
        if (!/^\d{5}$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be a 5-digit number.' });
        }
        const hashedPin = await bcrypt.hash(pin, 10);
        // Generate account number
        const accountNumber = await generateAccountNumber();

        // Create new user
        user = new User({
            firstName,
            lastName,
            email,
            dob,
            password: hashedPassword,
            gender,
            phoneNumber,
            pin: hashedPin,
            accountNumber,
            cardNumber: generateCardNumber(),  // Generate the card number here
            cardHolder: `${firstName} ${lastName}`,  // Set cardholder name
            expiryDate: generateExpiryDate(),  // Generate the expiry date
            cvv: generateCVV(),
            balance: 500
        });
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
       
        await user.save();
        const token = jwt.generateToken(user);
        console.log('OTP generated and saved successfully');

        try {
            await sendOTPEmail(user.email, otp);
            console.log(`OTP email sent to ${user.email}`);
        } catch (error) {
            // If OTP email fails, log the error and rollback OTP
            user.otp = null;
            user.otpExpires = null;
            
            console.error('Failed to send OTP email:', error.message);
            return res.status(500).json({ message: 'User registered, but failed to send OTP. Please try again.' });
        }
        try {
            await sendConfirmationEmail(user.email);
        }catch (error){
            console.error("error sending a confirmation email", error.message);
            return res.status(500).json({message: "email not sent"})
        }

        
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
            { userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, accountNumber: user.accountNumber, cardNumber: user.cardNumber, expiryDate: user.expiryDate, cvv: user.cvv },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // '1h', '7d', etc.
        );

        // Return token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { firstName: user.firstName, lastName: user.lastName, accountNumber: user.accountNumber, cardNumber: user.cardNumber, expiryDate: user.expiryDate, cvv: user.cvv}
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
        res.status(500).json({ message: 'Server error' });
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
            balance: user.balance || 1000,
            cardNumber: user.cardNumber,
            expiryDate: user.expiryDate,
            cvv: user.cvv
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser,
    loginUser,
    verifyOTP, 
    getDashboardData, 
    resetPassword, 
    forgotPassword
};
