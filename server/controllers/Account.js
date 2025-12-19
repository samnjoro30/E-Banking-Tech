const User = require('../models/User');
const { createFinancialAccount } = require('../services/accountService');

const createAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const idempotencyKey = req.headers['idempotency-key'];

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await createFinancialAccount(user, idempotencyKey);

    user.hasFinancialAccount = true;
    await user.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAccount,
};
