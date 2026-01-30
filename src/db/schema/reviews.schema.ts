import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { users } from './users.schema.js';

// Review target types
export const reviewTargetTypeEnum = ['Product', 'Seller'] as const;
export type ReviewTargetType = typeof reviewTargetTypeEnum[number];

export const reviews = sqliteTable('reviews', {
    reviewId: text('review_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    targetType: text('target_type', { enum: reviewTargetTypeEnum }).notNull(),
    targetId: text('target_id').notNull(), // ID of Product (listing) or Seller (user)
    orderId: text('order_id').notNull().references(() => orders.orderId),
    authorId: text('author_id').notNull().references(() => users.userId),
    rating: integer('rating').notNull(), // 1-5
    title: text('title'),
    comment: text('comment'),
    mediaUrls: text('media_urls', { mode: 'json' }), // Review images/videos
    isVerifiedPurchase: integer('is_verified_purchase', { mode: 'boolean' }).notNull().default(true),
    isModerated: integer('is_moderated', { mode: 'boolean' }).notNull().default(false),
    helpfulCount: integer('helpful_count').notNull().default(0),
    sellerResponse: text('seller_response'),
    sellerResponseAt: integer('seller_response_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
