const { pgTable, varchar, timestamp } = require('drizzle-orm/pg-core');

const idempotencyKeys = pgTable('idempotency_keys', {
  key: varchar('key').primaryKey(),
  operation: varchar('operation').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = idempotencyKeys;
