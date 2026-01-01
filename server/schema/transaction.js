const {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  jsonb,
} = require('drizzle-orm/pg-core');

const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: varchar('reference',  { length: 255 }).unique().notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  // TRANSFER | REFUND | REVERSAL | DEPOSIT | FEE | WITHDRAWAL
  description: varchar('description'),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('KES'),
  status: varchar('status',  { length: 20 }).default('PENDING'), // PENDING | COMPLETED | FAILED
  sourceAccountId: uuid('source_account_id'),
  destinationAccountId: uuid('destination_account_id'),
  originalTransactionId: uuid('original_transaction_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = transactions;
