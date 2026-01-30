import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Better Auth - Verifications Table
 * Stores verification tokens for email verification, password reset, etc.
 * 
 * Scalability: Tokens are short-lived and can be purged after expiration
 */
export const verifications = pgTable('verification', {
    id: text('id').primaryKey(),

    // Verification identifier (email, phone, etc.)
    identifier: text('identifier').notNull(),

    // Verification value/token
    value: text('value').notNull(),

    // Expiration
    expiresAt: timestamp('expires_at').notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
