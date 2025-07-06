const mongoose = require('mongoose');

const admins = new mongoose.Schema({
    FirstName: { type: String, require: true},
    LastName: { type: String, required: true},
    email: { type: String, required: true},
    PhoneNumber: { type: String, required: true},
    Password: { type: String, required: true},
});

module.exports = mongoose.model('AdminBank', admins);