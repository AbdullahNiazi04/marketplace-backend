import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema';
import { users } from './users.schema';

// Revenue ledger status
export const revenueStatusEnum = ['Pending', 'Held', 'Processed', 'Cancelled'] as const;
export type RevenueStatus = typeof revenueStatusEnum[number];

export const revenue = sqliteTable('revenue', {
    ledgerId: text('ledger_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').notNull().references(() => orders.orderId),
    sellerId: text('seller_id').notNull().references(() => users.userId),
    grossAmount: real('gross_amount').notNull(),
    platformFee: real('platform_fee').notNull(),
    processingFee: real('processing_fee').notNull().default(0),
    netPayout: real('net_payout').notNull(),
    feePercentage: real('fee_percentage').notNull(),
    status: text('status', { enum: revenueStatusEnum }).notNull().default('Pending'),
    payoutId: text('payout_id'), // Linked when payout is processed
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Revenue = typeof revenue.$inferSelect;
export type NewRevenue = typeof revenue.$inferInsert;
