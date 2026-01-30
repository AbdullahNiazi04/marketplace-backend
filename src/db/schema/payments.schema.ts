import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema';

// Escrow status
export const escrowStatusEnum = ['Held', 'Released', 'Refunded', 'Disputed'] as const;
export type EscrowStatus = typeof escrowStatusEnum[number];

// Payment status
export const paymentStatusEnum = ['Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled'] as const;
export type PaymentStatus = typeof paymentStatusEnum[number];

export const payments = sqliteTable('payments', {
    paymentId: text('payment_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').notNull().references(() => orders.orderId),
    transactionRef: text('transaction_ref').unique(),
    amount: real('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    escrowStatus: text('escrow_status', { enum: escrowStatusEnum }).notNull().default('Held'),
    paymentMethod: text('payment_method').notNull(), // Card, Bank, Wallet
    paymentProvider: text('payment_provider').notNull(), // Stripe, PayPal, etc.
    status: text('status', { enum: paymentStatusEnum }).notNull().default('Pending'),
    metadata: text('metadata', { mode: 'json' }), // Provider-specific data
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
