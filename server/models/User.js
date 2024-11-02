const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: {type: String, required: true, unique: true},
    dob: {type: String, required: true},
    gender: {type: String, required: true},
    password: { type: String, required: true },
    accountNumber: { type: String, unique: true },
    hashedPin: {type: String, required: true },  // Bank-specific field
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

userSchema.pre('save', async function(next) {
    if (this.isModified('hashedPin')) {
        this.hashedPin = await bcrypt.hash(this.hashedPin, 10);
    }
    next();
});
// Method to verify the PIN
userSchema.methods.verifyPin = async function(pin) {
    return await bcrypt.compare(pin, this.hashedPin);
};
// Pre-save hook to hash password before saving to the database

module.exports = mongoose.model('User', userSchema);

