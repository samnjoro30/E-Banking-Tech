// db/schema/transactions.js
const {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
} = require('drizzle-orm/pg-core');

const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: varchar('reference').unique().notNull(),
  description: varchar('description'),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  status: varchar('status').default('PENDING'), // PENDING | COMPLETED | FAILED
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = transactions;
