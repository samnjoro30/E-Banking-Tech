const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Report = require('../models/Report');

// Fetch all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { firstName, lastName, email }, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
};

// Deactivate a user
exports.deactivateUser = async (req, res) => {
    const { userId } = req.params;

    try {
        await User.findByIdAndUpdate(userId, { isActive: false });
        res.status(200).json({ message: 'User deactivated' });
    } catch (err) {
        res.status(500).json({ message: 'Error deactivating user', error: err });
    }
};

// Fetch audit logs
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('user');
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

// Fetch reports based on type
exports.getReports = async (req, res) => {
    const { type } = req.query;

    try {
        const reports = await Report.find({ type });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};
