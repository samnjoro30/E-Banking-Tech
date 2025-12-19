const Accounts = require('../schema/account');
const LedgerEn = require('../schema/ledgerEntries');
const transactions = require('../schema/transaction');
const idempotencyKeys = require('../schema/idemptotencyKeys');
const db = require('../config/db_Postgre');
const crypto = require('crypto');

const generateAccountNumber = () => {
  const year = new Date().getFullYear();
  const rand = crypto.randomInt(10000000, 99999999);
  return `AC${year}${rand}`;
};

const createFinancialAccount = async (mongoUser, idempotencyKey) => {
  if (!idempotencyKey) {
    throw new Error('Idempotency key required');
  }

  await db.transaction(async tx => {
    const existingKey = await tx
      .select()
      .from(idempotencyKeys)
      .where({ key: idempotencyKey });

    if (existingKey.length > 0) {
      return;
    }

    if (mongoUser.hasFinancialAccount) {
      return;
    }

    const accountNumber = generateAccountNumber();

    const account = await tx
      .insert(Accounts)
      .values({
        userId: mongoUser._id.toString(),
        accountNumber,
        balance: '0.00',
        status: 'ACTIVE',
      })
      .returning('*');

    const txn = await tx
      .insert(transactions)
      .values({
        reference: crypto.randomUUID(),
        description: 'Account opening',
        amount: '0.00',
        status: 'COMPLETED',
      })
      .returning('*');

    await tx.insert(LedgerEn).values({
      transactionId: txn[0].id,
      accountId: account[0].id,
      debit: '0.00',
      credit: '0.00',
      balanceAfter: '0.00',
    });

    await tx.insert(idempotencyKeys).values({
      key: idempotencyKey,
      operation: 'CREATE_ACCOUNT',
    });
  });
};

module.exports = {
  createFinancialAccount,
};
