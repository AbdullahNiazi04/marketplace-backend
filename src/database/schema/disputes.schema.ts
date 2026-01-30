import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
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

export const disputes = pgTable('disputes', {
    disputeId: uuid('dispute_id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.orderId),
    raisedBy: uuid('raised_by').notNull().references(() => users.userId),
    against: uuid('against').notNull().references(() => users.userId),
    reasonCode: text('reason_code', { enum: disputeReasonEnum }).notNull(),
    description: text('description').notNull(),
    evidenceUrls: jsonb('evidence_urls'), // Array of URLs
    status: text('status', { enum: disputeStatusEnum }).notNull().default('Open'),
    resolution: text('resolution', { enum: disputeResolutionEnum }).notNull().default('Pending'),
    resolutionNotes: text('resolution_notes'),
    resolvedBy: uuid('resolved_by').references(() => users.userId),
    responseDeadline: timestamp('response_deadline'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Dispute = typeof disputes.$inferSelect;
export type NewDispute = typeof disputes.$inferInsert;
