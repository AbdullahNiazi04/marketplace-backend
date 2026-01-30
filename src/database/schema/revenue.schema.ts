import { pgTable, text, doublePrecision, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { users } from './users.schema.js';

// Revenue ledger status
export const revenueStatusEnum = ['Pending', 'Held', 'Processed', 'Cancelled'] as const;
export type RevenueStatus = typeof revenueStatusEnum[number];

export const revenue = pgTable('revenue', {
    ledgerId: uuid('ledger_id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    sellerId: uuid('seller_id').notNull().references(() => users.userId),
    grossAmount: doublePrecision('gross_amount').notNull(),
    platformFee: doublePrecision('platform_fee').notNull(),
    processingFee: doublePrecision('processing_fee').notNull().default(0),
    netPayout: doublePrecision('net_payout').notNull(),
    feePercentage: doublePrecision('fee_percentage').notNull(),
    status: text('status', { enum: revenueStatusEnum }).notNull().default('Pending'),
    payoutId: uuid('payout_id'), // Linked when payout is processed
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Revenue = typeof revenue.$inferSelect;
export type NewRevenue = typeof revenue.$inferInsert;
