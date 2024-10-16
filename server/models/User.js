const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountNumber: { type: String, unique: true },  // Bank-specific field
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },  // Temporary OTP storage
    createdAt: { type: Date, default: Date.now },
    balance: { type: Number, default: 500 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    cardNumber: { type: String },  // Add cardNumber field to schema
    expiryDate: { type: String },  // Add expiryDate if needed
    cvv: { type: String }  // Add CVV if needed
});


// Pre-save hook to hash password before saving to the database

module.exports = mongoose.model('User', userSchema);

