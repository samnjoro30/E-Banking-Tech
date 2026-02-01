const Transaction = require('../models/transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();


const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('Fetching transactions for user:', userId);

    const user = await User.findById(userId).select('balance accountNumber');
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    const { balance, accountNumber } = user;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch transactions
    const transactions = await Transaction.find({ accountNumber })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recipientAccount', 'name')
      .lean();

    // Format output
    const transactionList = transactions.map(txn => ({
      description: txn.description,
      amount: txn.amount,
      type: txn.type,
      date: txn.date,
      recipientName: txn.recipientAccount ? txn.recipientAccount.name : 'N/A',
    }));

    // Count total
    const totalTransactions = await Transaction.countDocuments({
      accountNumber,
    });

    res.status(200).json({
      balance,
      transactions: transactionList,
      totalTransactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
    });
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
    return res
      .status(400)
      .json({ message: 'Amount must be greater than zero' });
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
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

const transferAttempts = {};

const transferFunds = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { recipient, amount } = req.body;
    const transferAmount = Number(amount);

    //rate limiting
    const lastAttempt = transferAttempts[req.user.accountNumber];
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < 30000) {
      return res
        .status(429)
        .json({ message: 'Too many transfer requests. Try again later.' });
    }
    transferAttempts[req.user.accountNumber] = now;

    //pin validation
    const sender = await User.findOne({
      accountNumber: req.user.accountNumber,
    });

    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer amount.' });
    }

    // Ensure that amount is a number and greater than 0
    if (typeof amount !== 'number' || amount <= 0) {
      return res
        .status(400)
        .json({ message: 'Amount must be a positive number.' });
    }

    const recipientUser = await User.findOne({ accountNumber: recipient }); // Find recipient by account number
    // Check if recipient exists and is different from the sender
    if (!recipientUser) {
      return res.status(400).json({ message: 'Recipient account not found.' });
    }

    if (sender.accountNumber === recipientUser.accountNumber) {
      return res
        .status(400)
        .json({ message: 'You cannot transfer money to your own account.' });
    }

    // Check if sender has enough balance
    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    //transactions begin
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct from sender's balance and save
      sender.balance -= transferAmount;
      await sender.save({ session });

      // Add to recipient's balance and save
      recipientUser.balance += transferAmount;
      await recipientUser.save({ session });

      // Generate transaction ID for traceability
      const transactionId = uuidv4();

      // Log both transactions
      const senderTransaction = new Transaction({
        userId: sender._id,
        amount: -transferAmount,
        type: 'debit',
        transactionId,
        description: `Transfer to account ${recipientUser.accountNumber}`,
      });
      await senderTransaction.save({ session });

      const recipientTransaction = new Transaction({
        userId: recipientUser._id,
        amount: transferAmount,
        type: 'credit',
        transactionId,
        description: `Received from account ${sender.accountNumber}`,
      });
      await recipientTransaction.save({ session });

      // Push transaction IDs into users' transaction lists
      sender.transactions.push(senderTransaction._id);
      recipientUser.transactions.push(recipientTransaction._id);

      await sender.save({ session });
      await recipientUser.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'Transfer successful.' });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('Transfer Error (rolled back):', err);
      res
        .status(500)
        .json({ message: 'Transfer failed due to an internal error.' });
    }
  } catch (error) {
    console.error('Transfer Error:', error); // More specific error log
    res.status(500).json({ message: 'Transfer failed.' });
  }
};
const Trans_notification = () => {};

module.exports = {
  getTransactions,
  createTransaction,
  transferFunds,
  Trans_notification,
};
