import { pgTable, text, boolean, timestamp, doublePrecision, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Business types
export const businessTypeEnum = ['SoleProprietor', 'Partnership', 'Corporation', 'LLC'] as const;
export type BusinessType = typeof businessTypeEnum[number];

// Company verification status
export const companyVerificationStatusEnum = ['Pending', 'Verified', 'Rejected'] as const;
export type CompanyVerificationStatus = typeof companyVerificationStatusEnum[number];

// Payment terms
export const paymentTermsEnum = ['Immediate', 'Net15', 'Net30', 'Net60'] as const;
export type PaymentTerms = typeof paymentTermsEnum[number];

export const companies = pgTable('companies', {
    companyId: uuid('company_id').primaryKey().defaultRandom(),
    companyName: text('company_name').notNull(),
    tradingName: text('trading_name'),
    taxId: text('tax_id').notNull().unique(),
    businessType: text('business_type', { enum: businessTypeEnum }).notNull(),
    industry: text('industry').notNull(),
    address: jsonb('address').notNull(),
    contactEmail: text('contact_email').notNull(),
    contactPhone: text('contact_phone').notNull(),
    verificationStatus: text('verification_status', { enum: companyVerificationStatusEnum }).notNull().default('Pending'),
    verificationDocs: jsonb('verification_docs'), // Array of URLs
    creditLimit: doublePrecision('credit_limit').notNull().default(0),
    paymentTerms: text('payment_terms', { enum: paymentTermsEnum }).notNull().default('Immediate'),
    creditBalance: doublePrecision('credit_balance').notNull().default(0),
    adminUserId: uuid('admin_user_id'), // Will be linked after user creation
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
