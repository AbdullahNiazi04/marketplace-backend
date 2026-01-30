import { pgTable, text, integer, doublePrecision, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';
import { categories } from './categories.schema';

// Listing types
export const listingTypeEnum = ['Auction', 'Fixed', 'B2BOnly'] as const;
export type ListingType = typeof listingTypeEnum[number];

// Customer type targeting
export const customerTypeEnum = ['B2C', 'B2B', 'Both'] as const;
export type CustomerType = typeof customerTypeEnum[number];

// Listing status
export const listingStatusEnum = ['Draft', 'Active', 'Expired', 'Sold', 'Suspended'] as const;
export type ListingStatus = typeof listingStatusEnum[number];

export const listings = pgTable('listings', {
    listingId: uuid('listing_id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id').notNull().references(() => users.userId),
    categoryId: uuid('category_id').notNull().references(() => categories.categoryId),
    title: text('title').notNull(),
    description: text('description').notNull(),
    listingType: text('listing_type', { enum: listingTypeEnum }).notNull().default('Fixed'),
    customerType: text('customer_type', { enum: customerTypeEnum }).notNull().default('Both'),
    price: doublePrecision('price').notNull(),
    b2bPrice: doublePrecision('b2b_price'),
    minOrderQty: integer('min_order_qty').notNull().default(1),
    stockQuantity: integer('stock_quantity').notNull().default(1),
    weight: doublePrecision('weight'), // in kg
    dimensions: jsonb('dimensions'), // { length, width, height } in cm
    mediaUrls: jsonb('media_urls').notNull().default('[]'), // Array of URLs
    specifications: jsonb('specifications'), // Technical specs
    status: text('status', { enum: listingStatusEnum }).notNull().default('Draft'),
    expiresAt: timestamp('expires_at'),
    viewCount: integer('view_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
