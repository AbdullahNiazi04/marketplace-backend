import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
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

export const users = pgTable('users', {
    userId: uuid('user_id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    userType: text('user_type', { enum: userTypeEnum }).notNull().default('Individual'),
    companyId: uuid('company_id').references(() => companies.companyId),
    role: text('role', { enum: userRoleEnum }).notNull().default('Buyer'),
    verificationStatus: text('verification_status', { enum: verificationStatusEnum }).notNull().default('Unverified'),
    isActive: boolean('is_active').notNull().default(true),
    lastLogin: timestamp('last_login'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
