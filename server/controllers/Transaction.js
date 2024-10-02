const Transaction = require('../models/transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
// Fetch user transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
};

// Create a transaction (e.g., transfer funds)
const createTransaction = async (req, res) => {
    const { description, amount, type } = req.body;

    if (!description || !amount || !type) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    if (!['credit', 'debit'].includes(type)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    try {
        const transaction = new Transaction({
            userId: req.userId,
            description,
            amount,
            type,
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create transaction' });
    }
};

const transferFunds = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { recipient, amount } = req.body;
        const sender = await User.findById(req.user.id).session(session);
        const recipientUser = await User.findOne({ accountNumber: recipient }).session(session);

        if (!recipientUser) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Recipient not found.' });
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        // Deduct from sender
        sender.balance -= amount;
        await sender.save({ session });

        // Add to recipient
        recipientUser.balance += amount;
        await recipientUser.save({ session });

        // Log transaction for both users
        const senderTransaction = new Transaction({
            userId: sender._id,
            amount: -amount,
            type: 'debit',
            description: `Transfer to ${recipientUser.accountNumber}`,
        });
        await senderTransaction.save({ session });

        const recipientTransaction = new Transaction({
            userId: recipientUser._id,
            amount: amount,
            type: 'credit',
            description: `Received from ${sender.accountNumber}`,
        });
        await recipientTransaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Transfer successful.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Transfer failed.' });
    }
};

module.exports = { getTransactions, createTransaction, transferFunds}

