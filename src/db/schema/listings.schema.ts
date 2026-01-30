import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema.js';
import { categories } from './categories.schema.js';

// Listing types
export const listingTypeEnum = ['Auction', 'Fixed', 'B2BOnly'] as const;
export type ListingType = typeof listingTypeEnum[number];

// Customer type targeting
export const customerTypeEnum = ['B2C', 'B2B', 'Both'] as const;
export type CustomerType = typeof customerTypeEnum[number];

// Listing status
export const listingStatusEnum = ['Draft', 'Active', 'Expired', 'Sold', 'Suspended'] as const;
export type ListingStatus = typeof listingStatusEnum[number];

export const listings = sqliteTable('listings', {
    listingId: text('listing_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    sellerId: text('seller_id').notNull().references(() => users.userId),
    categoryId: text('category_id').notNull().references(() => categories.categoryId),
    title: text('title').notNull(),
    description: text('description').notNull(),
    listingType: text('listing_type', { enum: listingTypeEnum }).notNull().default('Fixed'),
    customerType: text('customer_type', { enum: customerTypeEnum }).notNull().default('Both'),
    price: real('price').notNull(),
    b2bPrice: real('b2b_price'),
    minOrderQty: integer('min_order_qty').notNull().default(1),
    stockQuantity: integer('stock_quantity').notNull().default(1),
    weight: real('weight'), // in kg
    dimensions: text('dimensions', { mode: 'json' }), // { length, width, height } in cm
    mediaUrls: text('media_urls', { mode: 'json' }).notNull().default('[]'), // Array of URLs
    specifications: text('specifications', { mode: 'json' }), // Technical specs
    status: text('status', { enum: listingStatusEnum }).notNull().default('Draft'),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    viewCount: integer('view_count').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
