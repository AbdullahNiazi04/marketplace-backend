import { pgTable, text, integer, doublePrecision, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { listings } from './listings.schema.js';
import { users } from './users.schema.js';

// Order item status
export const orderItemStatusEnum = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as const;
export type OrderItemStatus = typeof orderItemStatusEnum[number];

export const orderItems = pgTable('order_items', {
    itemId: uuid('item_id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    listingId: uuid('listing_id').notNull().references(() => listings.listingId),
    sellerId: uuid('seller_id').notNull().references(() => users.userId),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: doublePrecision('unit_price').notNull(),
    totalPrice: doublePrecision('total_price').notNull(),
    itemStatus: text('item_status', { enum: orderItemStatusEnum }).notNull().default('Pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
