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
        to: email,
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
        console.log("Sending email with the following options:", mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error('Failed to send OTP email.');
    }
};

// Function to generate OTP code
const generateOTP = () => {
    return speakeasy.totp({
        secret: process.env.OTP_SECRET || 'mysecret',
        encoding: 'base32',
        digits: 6,
        step: parseInt(process.env.OTP_EXPIRY_SECONDS, 10) || 300 // Default 5-minute expiry
    });
};

module.exports = { sendOTPEmail, generateOTP };


// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//     process.env.GMAIL_CLIENT_ID,     // Client ID from Google Cloud
//     process.env.GMAIL_CLIENT_SECRET, // Client Secret from Google Cloud
//     "https://developers.google.com/oauthplayground"  // Redirect URI for OAuth2 Playground or your app's URI
// );

// // Set credentials (refresh token)
// oauth2Client.setCredentials({
//     refresh_token: process.env.GMAIL_REFRESH_TOKEN
// });

// // Create transporter with OAuth2
// const createTransporter = async () => {
//     const accessToken = await oauth2Client.getAccessToken();
//     console.log("Access token generated: ", accessToken);
//     if (!accessToken || !accessToken.token) {
//         throw new Error('Failed to get access token');
//     }
    
//     return nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             type: 'OAuth2',
//             user: process.env.EMAIL_USER,
//             clientId: process.env.GMAIL_CLIENT_ID,
//             clientSecret: process.env.GMAIL_CLIENT_SECRET,
//             refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//             accessToken: accessToken.token,  // Use the generated access token
//         }
//     });
// };
// const sendOTPEmail = async (email, otp) => {
//     const transporter = await createTransporter();
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'E-Banking Tech - OTP Verification',
//         html: `
//             <p>Dear User,</p>
//             <p>Your OTP code is: <strong>${otp}</strong>.</p>
//             <p>Please use this code to complete your authentication. The code will expire in 5 minutes.</p>
//             <p>If you didn't request this code, please ignore this email.</p>
//             <p>Best regards,<br>E-Banking Tech Team</p>
//         `
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log(`Email sent: ${info.response}`);
//         return info;
//     } catch (error) {
//         console.error(`Error sending email: ${error.message}`);
//         throw new Error('Failed to send OTP email.');
//     }
// };
