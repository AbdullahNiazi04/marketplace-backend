import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Better Auth - Verifications Table
 * Stores verification tokens for email verification, password reset, etc.
 * 
 * Scalability: Tokens are short-lived and can be purged after expiration
 */
export const verifications = sqliteTable('verification', {
    id: text('id').primaryKey(),

    // Verification identifier (email, phone, etc.)
    identifier: text('identifier').notNull(),

    // Verification value/token
    value: text('value').notNull(),

    // Expiration
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
