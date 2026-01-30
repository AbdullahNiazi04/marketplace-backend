import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';
import { users } from './users.schema.js';
import { conversations } from './conversations.schema.js';

// Message type enum
export const messageTypeEnum = ['Text', 'Image', 'File', 'System'] as const;

// Message status enum for delivery tracking
export const messageStatusEnum = ['Sent', 'Delivered', 'Read'] as const;

/**
 * Messages Table
 * Individual messages within a conversation
 * Designed for scalability with proper indexing fields
 */
export const messages = sqliteTable('messages', {
    messageId: text('message_id').primaryKey().$defaultFn(() => uuidv4()),

    // Parent conversation
    conversationId: text('conversation_id').notNull().references(() => conversations.conversationId),

    // Sender
    senderId: text('sender_id').notNull().references(() => users.userId),

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
    deletedForSender: integer('deleted_for_sender', { mode: 'boolean' }).default(false).notNull(),
    deletedForRecipient: integer('deleted_for_recipient', { mode: 'boolean' }).default(false).notNull(),

    // Reply/thread support (for future scalability)
    replyToMessageId: text('reply_to_message_id'),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    editedAt: integer('edited_at', { mode: 'timestamp' }),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
