import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';

// Payout status
export const payoutStatusEnum = ['Scheduled', 'Processing', 'Completed', 'Failed', 'Cancelled'] as const;
export type PayoutStatus = typeof payoutStatusEnum[number];

export const payouts = sqliteTable('payouts', {
    payoutId: text('payout_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    sellerId: text('seller_id').notNull().references(() => users.userId),
    amount: real('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    bankAccountInfo: text('bank_account_info', { mode: 'json' }).notNull(), // Encrypted bank details
    status: text('status', { enum: payoutStatusEnum }).notNull().default('Scheduled'),
    scheduledDate: integer('scheduled_date', { mode: 'timestamp' }).notNull(),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    transactionRef: text('transaction_ref'),
    failureReason: text('failure_reason'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;
