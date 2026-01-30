import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.schema';
import { users } from './users.schema';

// Dispute reason codes
export const disputeReasonEnum = ['NotReceived', 'NotAsDescribed', 'Damaged', 'WrongItem', 'Other'] as const;
export type DisputeReason = typeof disputeReasonEnum[number];

// Dispute status
export const disputeStatusEnum = ['Open', 'PendingResponse', 'UnderReview', 'Escalated', 'Resolved', 'Closed'] as const;
export type DisputeStatus = typeof disputeStatusEnum[number];

// Resolution types
export const disputeResolutionEnum = ['FullRefund', 'PartialRefund', 'EscrowRelease', 'NoAction', 'Pending'] as const;
export type DisputeResolution = typeof disputeResolutionEnum[number];

export const disputes = sqliteTable('disputes', {
    disputeId: text('dispute_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').notNull().references(() => orders.orderId),
    raisedBy: text('raised_by').notNull().references(() => users.userId),
    against: text('against').notNull().references(() => users.userId),
    reasonCode: text('reason_code', { enum: disputeReasonEnum }).notNull(),
    description: text('description').notNull(),
    evidenceUrls: text('evidence_urls', { mode: 'json' }), // Array of URLs
    status: text('status', { enum: disputeStatusEnum }).notNull().default('Open'),
    resolution: text('resolution', { enum: disputeResolutionEnum }).notNull().default('Pending'),
    resolutionNotes: text('resolution_notes'),
    resolvedBy: text('resolved_by').references(() => users.userId),
    responseDeadline: integer('response_deadline', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Dispute = typeof disputes.$inferSelect;
export type NewDispute = typeof disputes.$inferInsert;
