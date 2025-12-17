// db/schema/ledgerEntries.js
const { pgTable, uuid, numeric, timestamp } = require("drizzle-orm/pg-core");

const ledgerEntries = pgTable("ledger_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: uuid("transaction_id").notNull(),
  accountId: uuid("account_id").notNull(),
  debit: numeric("debit", { precision: 18, scale: 2 }).default("0.00"),
  credit: numeric("credit", { precision: 18, scale: 2 }).default("0.00"),
  balanceAfter: numeric("balance_after", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = ledgerEntries;
