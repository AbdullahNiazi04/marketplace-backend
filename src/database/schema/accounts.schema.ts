import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Better Auth - Accounts Table
 * Stores OAuth provider accounts linked to users
 * 
 * Scalability: One user can have multiple accounts (Google, GitHub, etc.)
 */
export const accounts = pgTable('account', {
    id: text('id').primaryKey(),

    // User reference
    userId: text('user_id').notNull(),

    // OAuth provider info
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),

    // Tokens (encrypted in production)
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

    // Token scope
    scope: text('scope'),

    // ID token for OIDC
    idToken: text('id_token'),

    // Password hash for email/password auth
    password: text('password'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
