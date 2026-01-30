import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { auctions } from './auctions.schema.js';
import { users } from './users.schema.js';

export const bids = sqliteTable('bids', {
    bidId: text('bid_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    auctionId: text('auction_id').notNull().references(() => auctions.auctionId),
    bidderId: text('bidder_id').notNull().references(() => users.userId),
    amount: real('amount').notNull(),
    maxBid: real('max_bid'), // Proxy bid maximum
    isProxy: integer('is_proxy', { mode: 'boolean' }).notNull().default(false),
    isWinning: integer('is_winning', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;
