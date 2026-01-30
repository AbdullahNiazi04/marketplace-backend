import { pgTable, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';
import { conversations } from './conversations.schema';

// Message type enum
export const messageTypeEnum = ['Text', 'Image', 'File', 'System'] as const;

// Message status enum for delivery tracking
export const messageStatusEnum = ['Sent', 'Delivered', 'Read'] as const;

/**
 * Messages Table
 * Individual messages within a conversation
 * Designed for scalability with proper indexing fields
 */
export const messages = pgTable('messages', {
    messageId: uuid('message_id').primaryKey().defaultRandom(),

    // Parent conversation
    conversationId: uuid('conversation_id').notNull().references(() => conversations.conversationId),

    // Sender
    senderId: uuid('sender_id').notNull().references(() => users.userId),

    // Message content
    content: text('content').notNull(),
    messageType: text('message_type', { enum: messageTypeEnum }).default('Text').notNull(),

    // For file/image messages
    attachmentUrl: text('attachment_url'),
    attachmentName: text('attachment_name'),
    attachmentSize: integer('attachment_size'), // in bytes

    // Delivery status
    status: text('status', { enum: messageStatusEnum }).default('Sent').notNull(),

    // Soft delete for "delete for me" feature
    deletedForSender: boolean('deleted_for_sender').default(false).notNull(),
    deletedForRecipient: boolean('deleted_for_recipient').default(false).notNull(),

    // Reply/thread support (for future scalability)
    replyToMessageId: uuid('reply_to_message_id'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    editedAt: timestamp('edited_at'),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
