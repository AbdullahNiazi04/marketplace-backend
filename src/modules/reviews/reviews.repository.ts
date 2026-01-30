import { Injectable, Inject } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import { reviews, Review, NewReview, reviewTargetTypeEnum } from '../../db/schema/index.js';

@Injectable()
export class ReviewsRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewReview): Promise<Review> {
        const result = await this.db.insert(reviews).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Review[]> {
        return this.db.select().from(reviews).orderBy(desc(reviews.createdAt));
    }

    async findById(reviewId: string): Promise<Review | undefined> {
        const result = await this.db.select().from(reviews).where(eq(reviews.reviewId, reviewId));
        return result[0];
    }

    async findByTarget(targetType: typeof reviewTargetTypeEnum[number], targetId: string): Promise<Review[]> {
        return this.db.select().from(reviews).where(
            and(
                eq(reviews.targetType, targetType),
                eq(reviews.targetId, targetId)
            )
        );
    }

    async findByAuthor(authorId: string): Promise<Review[]> {
        return this.db.select().from(reviews).where(eq(reviews.authorId, authorId));
    }

    async update(reviewId: string, data: Partial<NewReview>): Promise<Review | undefined> {
        const result = await this.db
            .update(reviews)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(reviews.reviewId, reviewId))
            .returning();
        return result[0];
    }

    async delete(reviewId: string): Promise<boolean> {
        const result = await this.db.delete(reviews).where(eq(reviews.reviewId, reviewId)).returning();
        return result.length > 0;
    }
}
