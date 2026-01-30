import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';
import { listings } from './listings.schema';

// Conversation status enum
export const conversationStatusEnum = ['Active', 'Archived', 'Blocked'] as const;

/**
 * Conversations Table
 * Represents a chat thread between a buyer and seller
 * Can optionally be linked to a specific listing
 */
export const conversations = pgTable('conversations', {
    conversationId: uuid('conversation_id').primaryKey().defaultRandom(),

    // Participants
    buyerId: uuid('buyer_id').notNull().references(() => users.userId),
    sellerId: uuid('seller_id').notNull().references(() => users.userId),

    // Optional: Link to a specific listing/product
    listingId: uuid('listing_id').references(() => listings.listingId),

    // Conversation metadata
    status: text('status', { enum: conversationStatusEnum }).default('Active').notNull(),

    // Last message preview for listing
    lastMessagePreview: text('last_message_preview'),
    lastMessageAt: timestamp('last_message_at'),

    // Unread counts for each participant
    buyerUnreadCount: integer('buyer_unread_count').default(0).notNull(),
    sellerUnreadCount: integer('seller_unread_count').default(0).notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
