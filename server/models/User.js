const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: {type: String, required: true, unique: true},
    //dob: {type: String, required: true},
    gender: {type: String, required: true},
    password: { type: String, required: true },
    accountNumber: { type: String, unique: true },
    //pin: {type: String, required: true },  // Bank-specific field
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },  // Temporary OTP storage
    createdAt: { type: Date, default: Date.now },
    balance: { type: Number, default: 500 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

module.exports = mongoose.model('User', userSchema);

