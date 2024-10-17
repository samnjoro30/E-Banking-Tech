const Transaction = require('../models/transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
// Fetch user transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findOne({ accountNumber: req.accountNumber }).sort({ date: -1 });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        
        res.json(Array.isArray(transactions) ? transactions : [transactions]);
    } catch (err) {
        console.error('Error fetching transactions:', err);
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
    try {
        const { recipient, amount } = req.body;
        const transferAmount = Number(amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ message: 'Invalid transfer amount.' });
        }
        
        // Ensure that amount is a number and greater than 0
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        const sender = await User.findOne({ accountNumber: req.user.accountNumber }); // The sender is the logged-in user
        if (!sender) {
            return res.status(404).json({ message: 'Sender account not found.' });
        }

        const recipientUser = await User.findOne({ accountNumber: recipient }); // Find recipient by account number
        // Check if recipient exists and is different from the sender
        if (!recipientUser) {
            return res.status(400).json({ message: 'Recipient account not found.' });
        }

        if (sender.accountNumber === recipientUser.accountNumber) {
            return res.status(400).json({ message: 'You cannot transfer money to your own account.' });
        }

        // Check if sender has enough balance
        if (sender.balance < transferAmount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        // Deduct amount from sender's balance
        sender.balance -= transferAmount;
        await sender.save();

        // Add amount to recipient's balance
        recipientUser.balance += transferAmount;
        await recipientUser.save();

        // Log sender's transaction
        const senderTransaction = new Transaction({
            userId: sender._id,
            amount: -transferAmount,
            type: 'debit',
            description: `Transfer to account ${recipientUser.accountNumber}`,
        });
        await senderTransaction.save();

        // Log recipient's transaction
        const recipientTransaction = new Transaction({
            userId: recipientUser._id,
            amount: transferAmount,
            type: 'credit',
            description: `Received from account ${sender.accountNumber}`,
        });
        await recipientTransaction.save();

        sender.transactions.push(senderTransaction._id);
        recipientUser.transactions.push(recipientTransaction._id);
        await sender.save();
        await recipientUser.save();


        res.status(200).json({ message: 'Transfer successful.' });
    } catch (error) {
        console.error('Transfer Error:', error); // More specific error log
        res.status(500).json({ message: 'Transfer failed.' });
    }
};

module.exports = { getTransactions, createTransaction, transferFunds}

