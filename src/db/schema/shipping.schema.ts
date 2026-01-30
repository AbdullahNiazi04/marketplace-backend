import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { orderItems } from './order-items.schema.js';

// Shipping status
export const shippingStatusEnum = ['Pending', 'Shipped', 'InTransit', 'Delivered', 'Returned', 'Lost'] as const;
export type ShippingStatus = typeof shippingStatusEnum[number];

export const shipping = sqliteTable('shipping', {
    shippingId: text('shipping_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').notNull().references(() => orders.orderId),
    orderItemId: text('order_item_id').references(() => orderItems.itemId),
    carrierName: text('carrier_name').notNull(), // FedEx, UPS, DHL, etc.
    trackingNumber: text('tracking_number'),
    shippingCost: real('shipping_cost').notNull().default(0),
    estimatedDelivery: integer('estimated_delivery', { mode: 'timestamp' }),
    actualDelivery: integer('actual_delivery', { mode: 'timestamp' }),
    status: text('status', { enum: shippingStatusEnum }).notNull().default('Pending'),
    signatureRequired: integer('signature_required', { mode: 'boolean' }).notNull().default(false),
    trackingHistory: text('tracking_history', { mode: 'json' }), // Array of status updates
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Shipping = typeof shipping.$inferSelect;
export type NewShipping = typeof shipping.$inferInsert;
