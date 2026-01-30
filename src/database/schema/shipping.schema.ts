import { pgTable, text, boolean, doublePrecision, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { orderItems } from './order-items.schema.js';

// Shipping status
export const shippingStatusEnum = ['Pending', 'Shipped', 'InTransit', 'Delivered', 'Returned', 'Lost'] as const;
export type ShippingStatus = typeof shippingStatusEnum[number];

export const shipping = pgTable('shipping', {
    shippingId: uuid('shipping_id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    orderItemId: uuid('order_item_id').references(() => orderItems.itemId),
    carrierName: text('carrier_name').notNull(), // FedEx, UPS, DHL, etc.
    trackingNumber: text('tracking_number'),
    shippingCost: doublePrecision('shipping_cost').notNull().default(0),
    estimatedDelivery: timestamp('estimated_delivery'),
    actualDelivery: timestamp('actual_delivery'),
    status: text('status', { enum: shippingStatusEnum }).notNull().default('Pending'),
    signatureRequired: boolean('signature_required').notNull().default(false),
    trackingHistory: jsonb('tracking_history'), // Array of status updates
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Shipping = typeof shipping.$inferSelect;
export type NewShipping = typeof shipping.$inferInsert;
