import { pgTable, text, doublePrecision, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';

// Payout status
export const payoutStatusEnum = ['Scheduled', 'Processing', 'Completed', 'Failed', 'Cancelled'] as const;
export type PayoutStatus = typeof payoutStatusEnum[number];

export const payouts = pgTable('payouts', {
    payoutId: uuid('payout_id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id').notNull().references(() => users.userId),
    amount: doublePrecision('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    bankAccountInfo: jsonb('bank_account_info').notNull(), // Encrypted bank details
    status: text('status', { enum: payoutStatusEnum }).notNull().default('Scheduled'),
    scheduledDate: timestamp('scheduled_date').notNull(),
    processedAt: timestamp('processed_at'),
    transactionRef: text('transaction_ref'),
    failureReason: text('failure_reason'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;
