import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { listings } from './listings.schema';
import { users } from './users.schema';

// Auction status
export const auctionStatusEnum = ['Scheduled', 'Active', 'Ended', 'Cancelled'] as const;
export type AuctionStatus = typeof auctionStatusEnum[number];

export const auctions = sqliteTable('auctions', {
    auctionId: text('auction_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    listingId: text('listing_id').notNull().references(() => listings.listingId),
    minBid: real('min_bid').notNull(),
    currentHighBid: real('current_high_bid'),
    bidIncrement: real('bid_increment').notNull().default(1.00),
    reservePrice: real('reserve_price'), // Hidden minimum
    startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
    endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
    winnerId: text('winner_id').references(() => users.userId),
    status: text('status', { enum: auctionStatusEnum }).notNull().default('Scheduled'),
    bidCount: integer('bid_count').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Auction = typeof auctions.$inferSelect;
export type NewAuction = typeof auctions.$inferInsert;
