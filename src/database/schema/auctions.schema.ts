import { pgTable, text, integer, doublePrecision, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { listings } from './listings.schema.js';
import { users } from './users.schema.js';

// Auction status
export const auctionStatusEnum = ['Scheduled', 'Active', 'Ended', 'Cancelled'] as const;
export type AuctionStatus = typeof auctionStatusEnum[number];

export const auctions = pgTable('auctions', {
    auctionId: uuid('auction_id').primaryKey().defaultRandom(),
    listingId: uuid('listing_id').notNull().references(() => listings.listingId),
    minBid: doublePrecision('min_bid').notNull(),
    currentHighBid: doublePrecision('current_high_bid'),
    bidIncrement: doublePrecision('bid_increment').notNull().default(1.00),
    reservePrice: doublePrecision('reserve_price'), // Hidden minimum
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    winnerId: uuid('winner_id').references(() => users.userId),
    status: text('status', { enum: auctionStatusEnum }).notNull().default('Scheduled'),
    bidCount: integer('bid_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Auction = typeof auctions.$inferSelect;
export type NewAuction = typeof auctions.$inferInsert;
