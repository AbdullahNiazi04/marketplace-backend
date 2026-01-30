import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Better Auth - Accounts Table
 * Stores OAuth provider accounts linked to users
 * 
 * Scalability: One user can have multiple accounts (Google, GitHub, etc.)
 */
export const accounts = sqliteTable('account', {
    id: text('id').primaryKey(),

    // User reference
    userId: text('user_id').notNull(),

    // OAuth provider info
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),

    // Tokens (encrypted in production)
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),

    // Token scope
    scope: text('scope'),

    // ID token for OIDC
    idToken: text('id_token'),

    // Password hash for email/password auth
    password: text('password'),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
