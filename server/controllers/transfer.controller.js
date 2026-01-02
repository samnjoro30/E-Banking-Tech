const { transferFunds } = require('../services/transfer.service');
const Accounts = require('../schema/account');

const transferController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recipientAccountNumber, amount } = req.body;
    const idempotencyKey = req.idempotencyKey;

    if (!recipientAccountNumber || !amount) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const senderAccount = await Accounts.findOne({
      userId,
    });

    if (!senderAccount) {
      return res.status(404).json({ message: 'Sender account not found' });
    }

    const recipientAccount = await Accounts.findOne({
      accountNumber: recipientAccountNumber,
    });

    if (!recipientAccount) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    const result = await transferFunds({
      senderAccountId: senderAccount.id,
      recipientAccountId: recipientAccount.id,
      amount,
      idempotencyKey,
    });

    res.status(200).json({
      message: 'Transfer successful',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || 'Transfer failed',
    });
  }
};

module.exports = {
  transferController,
};
