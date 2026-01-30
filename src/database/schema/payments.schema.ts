import { pgTable, text, doublePrecision, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';

// Escrow status
export const escrowStatusEnum = ['Held', 'Released', 'Refunded', 'Disputed'] as const;
export type EscrowStatus = typeof escrowStatusEnum[number];

// Payment status
export const paymentStatusEnum = ['Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled'] as const;
export type PaymentStatus = typeof paymentStatusEnum[number];

export const payments = pgTable('payments', {
    paymentId: uuid('payment_id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    transactionRef: text('transaction_ref').unique(),
    amount: doublePrecision('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    escrowStatus: text('escrow_status', { enum: escrowStatusEnum }).notNull().default('Held'),
    paymentMethod: text('payment_method').notNull(), // Card, Bank, Wallet
    paymentProvider: text('payment_provider').notNull(), // Stripe, PayPal, etc.
    status: text('status', { enum: paymentStatusEnum }).notNull().default('Pending'),
    metadata: jsonb('metadata'), // Provider-specific data
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
