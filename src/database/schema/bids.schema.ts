import { pgTable, doublePrecision, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { auctions } from './auctions.schema.js';
import { users } from './users.schema.js';

export const bids = pgTable('bids', {
    bidId: uuid('bid_id').primaryKey().defaultRandom(),
    auctionId: uuid('auction_id').notNull().references(() => auctions.auctionId),
    bidderId: uuid('bidder_id').notNull().references(() => users.userId),
    amount: doublePrecision('amount').notNull(),
    maxBid: doublePrecision('max_bid'), // Proxy bid maximum
    isProxy: boolean('is_proxy').notNull().default(false),
    isWinning: boolean('is_winning').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;
