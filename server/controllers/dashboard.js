// controllers/dashboard.js
const User = require('../models/User');

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      'firstName lastName email accountNumber balance'
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
};