const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  senderAccountNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientAccountNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
