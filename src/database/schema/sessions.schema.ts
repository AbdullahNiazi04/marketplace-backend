import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Better Auth - Sessions Table
 * Stores active user sessions for authentication
 * 
 * Scalability: Sessions can be purged periodically for expired entries
 */
export const sessions = pgTable('session', {
    id: text('id').primaryKey(),

    // User reference (Better Auth internal user ID)
    userId: text('user_id').notNull(),

    // Session token for validation
    token: text('token').notNull().unique(),

    // IP and User Agent for security
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    // Expiration
    expiresAt: timestamp('expires_at').notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
