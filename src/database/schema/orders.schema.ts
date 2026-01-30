import { pgTable, text, doublePrecision, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';
import { companies } from './companies.schema';

// Order type for B2B/B2C distinction
export const orderTypeEnum = ['B2C', 'B2B'] as const;
export type OrderType = typeof orderTypeEnum[number];

// Payment terms (reused from companies)
export const orderPaymentTermsEnum = ['Immediate', 'Net15', 'Net30', 'Net60'] as const;
export type OrderPaymentTerms = typeof orderPaymentTermsEnum[number];

// Order status
export const orderStatusEnum = ['Pending', 'AwaitingPayment', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as const;
export type OrderStatus = typeof orderStatusEnum[number];

export const orders = pgTable('orders', {
    orderId: uuid('order_id').primaryKey().defaultRandom(),
    orderNumber: text('order_number').notNull().unique(),
    buyerId: uuid('buyer_id').notNull().references(() => users.userId),
    companyId: uuid('company_id').references(() => companies.companyId),
    orderType: text('order_type', { enum: orderTypeEnum }).notNull().default('B2C'),
    poNumber: text('po_number'), // B2B Purchase Order number
    subtotal: doublePrecision('subtotal').notNull(),
    bulkDiscount: doublePrecision('bulk_discount').notNull().default(0),
    taxAmount: doublePrecision('tax_amount').notNull().default(0),
    shippingFee: doublePrecision('shipping_fee').notNull().default(0),
    platformFee: doublePrecision('platform_fee').notNull().default(0),
    totalAmount: doublePrecision('total_amount').notNull(),
    paymentTerms: text('payment_terms', { enum: orderPaymentTermsEnum }).notNull().default('Immediate'),
    paymentDueDate: timestamp('payment_due_date'),
    orderStatus: text('order_status', { enum: orderStatusEnum }).notNull().default('Pending'),
    shippingAddress: jsonb('shipping_address').notNull(),
    billingAddress: jsonb('billing_address').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
