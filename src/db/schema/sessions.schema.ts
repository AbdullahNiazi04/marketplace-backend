import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Better Auth - Sessions Table
 * Stores active user sessions for authentication
 * 
 * Scalability: Sessions can be purged periodically for expired entries
 */
export const sessions = sqliteTable('session', {
    id: text('id').primaryKey(),

    // User reference (Better Auth internal user ID)
    userId: text('user_id').notNull(),

    // Session token for validation
    token: text('token').notNull().unique(),

    // IP and User Agent for security
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    // Expiration
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
