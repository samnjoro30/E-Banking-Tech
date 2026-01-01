const crypto = require('crypto');
const { eq, sql } = require('drizzle-orm');

const { db } = require('../config/db_Postgre');
const Accounts = require('../schema/account');
const Transactions = require('../schema/transaction');
const LedgerEntries = require('../schema/ledgerEntries');
const IdempotencyKeys = require('../schema/idemptotencyKeys');

const transferFunds = async ({
  senderAccountId,
  recipientAccountId,
  amount,
  idempotencyKey,
}) => {
  if (senderAccountId === recipientAccountId) {
    throw new Error('Sender and recipient cannot be the same');
  }

  return await db.transaction(async tx => {
    //Idompotency check
    const existing = await tx
      .select()
      .from(IdempotencyKeys)
      .where(eq(IdempotencyKeys.key, idempotencyKey));

    if (existing.length > 0) {
      return existing[0].response;
    }
    //lock sender  and recipient accounts
    const [sender] = await tx
      .select()
      .from(Accounts)
      .where(eq(Accounts.id, senderAccountId))
      .for('update');

    const [recipient] = await tx
      .select()
      .from(Accounts)
      .where(eq(Accounts.id, recipientAccountId))
      .for('update');

    if (!sender || !recipient) {
      throw new Error('Account not found');
    }

    if (sender.status !== 'ACTIVE' || recipient.status !== 'ACTIVE') {
      throw new Error('Account not active');
    }

    //balance check
    const [{ balance }] = await tx.execute(sql`
            SELECT COALESCE(SUM(credit) - SUM(debit), 0) AS balance
            FROM ledger_entries
            WHERE account_id = ${senderAccountId}
       `);

    if (Number(balance) < Number(amount)) {
      throw new Error('Insufficient balance');
    }
    // Create transaction record
    const reference = crypto.randomUUID();

    const [transaction] = await tx
      .insert(Transactions)
      .values({
        reference,
        type: 'TRANSFER',
        amount,
        status: 'PENDING',
        sourceAccountId: senderAccountId,
        destinationAccountId: recipientAccountId,
        description: 'Account transfer',
      })
      .returning();

    //Ledger entries - double entry

    const senderBalanceAfter = Number(balance) - Number(amount);

    await tx.insert(LedgerEntries).values([
      {
        transactionId: transaction.id,
        accountId: senderAccountId,
        debit: amount,
        credit: '0.00',
        balanceAfter: senderBalanceAfter.toFixed(2),
      },
      {
        transactionId: transaction.id,
        accountId: recipientAccountId,
        debit: '0.00',
        credit: amount,
        balanceAfter: (Number(recipient.balance) + Number(amount)).toFixed(2),
      },
    ]);

    //update cached balances

    await tx
      .update(Accounts)
      .set({ balance: senderBalanceAfter.toFixed(2) })
      .where(eq(Accounts.id, senderAccountId));

    await tx
      .update(Accounts)
      .set({
        balance: (Number(recipient.balance) + Number(amount)).toFixed(2),
      })
      .where(eq(Accounts.id, recipientAccountId));

    //mark transaction as completed
    await tx
      .update(Transactions)
      .set({ status: 'COMPLETED' })
      .where(eq(Transactions.id, transaction.id));

    const response = {
      transactionId: transaction.id,
      reference,
      amount,
      status: 'COMPLETED',
    };

    //store idompotency key
    await tx.insert(IdempotencyKeys).values({
      key: idempotencyKey,
      operation: 'TRANSFER',
      response,
    });

    return response;
  });
};

module.exports = {
  transferFunds,
};
