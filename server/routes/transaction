const express = require('express');
const router = express.Router();
const {transferFunds, getTransactions, createTransaction, Trans_notification} = require('../controllers/Transaction');
const  authMiddleware  = require('../middlewares/authMiddleware');
const { check, body, validationResult } = require('express-validator');
///






// Fetch user transactions
router.get('/transactions', authMiddleware, getTransactions);

router.post('/transfer', 
    [
      body('recipient').notEmpty().withMessage('Recipient is required'),
      body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
      check('pin').isString().withMessage('PIN is required for security verification.')
    ],
    authMiddleware, 
    transferFunds
 );
// Create a transaction (e.g., transfer funds)
router.post('/transactions', authMiddleware, createTransaction);
router.post('/notification', Trans_notification);

module.exports = router;


