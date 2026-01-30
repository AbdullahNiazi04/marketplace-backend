import { Injectable, Inject } from '@nestjs/common';
import { eq, and, like, desc, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import { listings, Listing, NewListing } from '../../db/schema/index.js';

@Injectable()
export class ListingsRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewListing): Promise<Listing> {
        const result = await this.db.insert(listings).values(data).returning();
        return result[0];
    }

    async findAll(limit = 50, offset = 0): Promise<Listing[]> {
        return this.db.select().from(listings).limit(limit).offset(offset).orderBy(desc(listings.createdAt));
    }

    async findById(listingId: string): Promise<Listing | undefined> {
        const result = await this.db.select().from(listings).where(eq(listings.listingId, listingId));
        return result[0];
    }

    async findBySellerId(sellerId: string): Promise<Listing[]> {
        return this.db.select().from(listings).where(eq(listings.sellerId, sellerId));
    }

    async findByCategoryId(categoryId: string): Promise<Listing[]> {
        return this.db.select().from(listings).where(eq(listings.categoryId, categoryId));
    }

    async findActive(): Promise<Listing[]> {
        return this.db.select().from(listings).where(eq(listings.status, 'Active'));
    }

    async search(query: string): Promise<Listing[]> {
        return this.db.select().from(listings).where(
            and(
                like(listings.title, `%${query}%`),
                eq(listings.status, 'Active')
            )
        );
    }

    async update(listingId: string, data: Partial<NewListing>): Promise<Listing | undefined> {
        const result = await this.db
            .update(listings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(listings.listingId, listingId))
            .returning();
        return result[0];
    }

    async delete(listingId: string): Promise<boolean> {
        const result = await this.db.delete(listings).where(eq(listings.listingId, listingId)).returning();
        return result.length > 0;
    }

    async incrementViewCount(listingId: string): Promise<void> {
        await this.db.update(listings)
            .set({ viewCount: sql`${listings.viewCount} + 1` })
            .where(eq(listings.listingId, listingId));
    }
}
