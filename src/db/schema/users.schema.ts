import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { companies } from './companies.schema';

// User types for B2B/B2C distinction
export const userTypeEnum = ['Individual', 'Business'] as const;
export type UserType = typeof userTypeEnum[number];

// User roles
export const userRoleEnum = ['Buyer', 'Seller', 'Admin', 'Support'] as const;
export type UserRole = typeof userRoleEnum[number];

// Verification status
export const verificationStatusEnum = ['Unverified', 'EmailVerified', 'IDVerified'] as const;
export type VerificationStatus = typeof verificationStatusEnum[number];

export const users = sqliteTable('users', {
    userId: text('user_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    userType: text('user_type', { enum: userTypeEnum }).notNull().default('Individual'),
    companyId: text('company_id').references(() => companies.companyId),
    role: text('role', { enum: userRoleEnum }).notNull().default('Buyer'),
    verificationStatus: text('verification_status', { enum: verificationStatusEnum }).notNull().default('Unverified'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    lastLogin: integer('last_login', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
