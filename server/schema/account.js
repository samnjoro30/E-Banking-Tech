const { pgTable, uuid, varchar, numeric, timestamp } = require('drizzle-orm/pg-core');

const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(),           // Link to Mongo user _id
  accountNumber: varchar('account_number').unique().notNull(),
  balance: numeric('balance', { precision: 18, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = accounts;
