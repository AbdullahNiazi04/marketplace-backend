
import { drizzle } from 'drizzle-orm/node-postgres';
import * as pg from 'pg';
const { Pool } = pg;
import * as schema from '../db/schema/index.js';

// Create Postgres connection for Better Auth
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });


/**
 * Better Auth Instance (Promise)
 * 
 * Configuration for authentication in Nizron Marketplace
 * - Email/Password authentication enabled
 * - Session-based auth with database storage
 * - Drizzle ORM adapter for PostgreSQL
 */
export const auth = (async () => {
    const { betterAuth, APIError } = await import('better-auth');
    const { drizzleAdapter } = await import('better-auth/adapters/drizzle');

    return betterAuth({
        // Database configuration using Drizzle adapter
        database: drizzleAdapter(db, {
            provider: 'pg',
        }),

        // Base URL for auth routes
        baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

        // Secret for signing tokens (must be 32+ chars)
        secret: process.env.BETTER_AUTH_SECRET || 'temporary_dev_secret_MUST_BE_CHANGED_IN_PROD_12345',

        // Email and Password authentication
        emailAndPassword: {
            enabled: true,
            // Require email verification (optional, can enable later)
            requireEmailVerification: false,
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        if (!user.email.endsWith('@gmail.com')) {
                            throw new APIError("BAD_REQUEST", { message: "Only Gmail accounts are allowed" });
                        }
                        return {
                            data: user
                        }
                    },
                },
            },
        },

        // Session configuration
        session: {
            // Session expiry in seconds (7 days)
            expiresIn: 60 * 60 * 24 * 7,
            // Update session expiry on each request
            updateAge: 60 * 60 * 24, // Update every 24 hours
            // Cookie settings
            cookieCache: {
                enabled: true,
                maxAge: 60 * 5, // 5 minutes cache
            },
        },

        // User configuration
        user: {
            // Additional fields to store on user
            additionalFields: {
                role: {
                    type: 'string',
                    defaultValue: 'Buyer',
                    required: false,
                },
            },
        },

        // Trust proxy for production (behind load balancer)
        trustedOrigins: [
            'http://localhost:3000',
            'http://localhost:5173', // Vite dev server
        ],
    });
})();

// Export auth type for type safety
export type Auth = Awaited<typeof auth>;
