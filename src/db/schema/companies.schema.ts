import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
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

export const companies = sqliteTable('companies', {
    companyId: text('company_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    companyName: text('company_name').notNull(),
    tradingName: text('trading_name'),
    taxId: text('tax_id').notNull().unique(),
    businessType: text('business_type', { enum: businessTypeEnum }).notNull(),
    industry: text('industry').notNull(),
    address: text('address', { mode: 'json' }).notNull(), // JSONB equivalent
    contactEmail: text('contact_email').notNull(),
    contactPhone: text('contact_phone').notNull(),
    verificationStatus: text('verification_status', { enum: companyVerificationStatusEnum }).notNull().default('Pending'),
    verificationDocs: text('verification_docs', { mode: 'json' }), // Array of URLs
    creditLimit: real('credit_limit').notNull().default(0),
    paymentTerms: text('payment_terms', { enum: paymentTermsEnum }).notNull().default('Immediate'),
    creditBalance: real('credit_balance').notNull().default(0),
    adminUserId: text('admin_user_id'), // Will be linked after user creation
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
