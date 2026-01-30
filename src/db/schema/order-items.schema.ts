import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema';
import { listings } from './listings.schema';
import { users } from './users.schema';

// Order item status
export const orderItemStatusEnum = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as const;
export type OrderItemStatus = typeof orderItemStatusEnum[number];

export const orderItems = sqliteTable('order_items', {
    itemId: text('item_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').notNull().references(() => orders.orderId),
    listingId: text('listing_id').notNull().references(() => listings.listingId),
    sellerId: text('seller_id').notNull().references(() => users.userId),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: real('unit_price').notNull(),
    totalPrice: real('total_price').notNull(),
    itemStatus: text('item_status', { enum: orderItemStatusEnum }).notNull().default('Pending'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
