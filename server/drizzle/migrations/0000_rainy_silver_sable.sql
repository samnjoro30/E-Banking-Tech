CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"account_number" varchar NOT NULL,
	"balance" numeric(18, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" varchar NOT NULL,
	"description" varchar,
	"amount" numeric(18, 2) NOT NULL,
	"status" varchar DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"debit" numeric(18, 2) DEFAULT '0.00',
	"credit" numeric(18, 2) DEFAULT '0.00',
	"balance_after" numeric(18, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
