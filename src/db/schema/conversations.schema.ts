import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';
import { users } from './users.schema';
import { listings } from './listings.schema';

// Conversation status enum
export const conversationStatusEnum = ['Active', 'Archived', 'Blocked'] as const;

/**
 * Conversations Table
 * Represents a chat thread between a buyer and seller
 * Can optionally be linked to a specific listing
 */
export const conversations = sqliteTable('conversations', {
    conversationId: text('conversation_id').primaryKey().$defaultFn(() => uuidv4()),

    // Participants
    buyerId: text('buyer_id').notNull().references(() => users.userId),
    sellerId: text('seller_id').notNull().references(() => users.userId),

    // Optional: Link to a specific listing/product
    listingId: text('listing_id').references(() => listings.listingId),

    // Conversation metadata
    status: text('status', { enum: conversationStatusEnum }).default('Active').notNull(),

    // Last message preview for listing
    lastMessagePreview: text('last_message_preview'),
    lastMessageAt: integer('last_message_at', { mode: 'timestamp' }),

    // Unread counts for each participant
    buyerUnreadCount: integer('buyer_unread_count').default(0).notNull(),
    sellerUnreadCount: integer('seller_unread_count').default(0).notNull(),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
