import { pgTable, text, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema.js';
import { users } from './users.schema.js';

// Review target types
export const reviewTargetTypeEnum = ['Product', 'Seller'] as const;
export type ReviewTargetType = typeof reviewTargetTypeEnum[number];

export const reviews = pgTable('reviews', {
    reviewId: uuid('review_id').primaryKey().defaultRandom(),
    targetType: text('target_type', { enum: reviewTargetTypeEnum }).notNull(),
    targetId: uuid('target_id').notNull(), // ID of Product (listing) or Seller (user)
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    authorId: uuid('author_id').notNull().references(() => users.userId),
    rating: integer('rating').notNull(), // 1-5
    title: text('title'),
    comment: text('comment'),
    mediaUrls: jsonb('media_urls'), // Review images/videos
    isVerifiedPurchase: boolean('is_verified_purchase').notNull().default(true),
    isModerated: boolean('is_moderated').notNull().default(false),
    helpfulCount: integer('helpful_count').notNull().default(0),
    sellerResponse: text('seller_response'),
    sellerResponseAt: timestamp('seller_response_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
