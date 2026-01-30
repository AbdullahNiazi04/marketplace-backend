import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema.js';
import { companies } from './companies.schema.js';

// Order type for B2B/B2C distinction
export const orderTypeEnum = ['B2C', 'B2B'] as const;
export type OrderType = typeof orderTypeEnum[number];

// Payment terms (reused from companies)
export const orderPaymentTermsEnum = ['Immediate', 'Net15', 'Net30', 'Net60'] as const;
export type OrderPaymentTerms = typeof orderPaymentTermsEnum[number];

// Order status
export const orderStatusEnum = ['Pending', 'AwaitingPayment', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as const;
export type OrderStatus = typeof orderStatusEnum[number];

export const orders = sqliteTable('orders', {
    orderId: text('order_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderNumber: text('order_number').notNull().unique(),
    buyerId: text('buyer_id').notNull().references(() => users.userId),
    companyId: text('company_id').references(() => companies.companyId),
    orderType: text('order_type', { enum: orderTypeEnum }).notNull().default('B2C'),
    poNumber: text('po_number'), // B2B Purchase Order number
    subtotal: real('subtotal').notNull(),
    bulkDiscount: real('bulk_discount').notNull().default(0),
    taxAmount: real('tax_amount').notNull().default(0),
    shippingFee: real('shipping_fee').notNull().default(0),
    platformFee: real('platform_fee').notNull().default(0),
    totalAmount: real('total_amount').notNull(),
    paymentTerms: text('payment_terms', { enum: orderPaymentTermsEnum }).notNull().default('Immediate'),
    paymentDueDate: integer('payment_due_date', { mode: 'timestamp' }),
    orderStatus: text('order_status', { enum: orderStatusEnum }).notNull().default('Pending'),
    shippingAddress: text('shipping_address', { mode: 'json' }).notNull(),
    billingAddress: text('billing_address', { mode: 'json' }).notNull(),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
