import { Injectable, Inject } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { categories, Category, NewCategory } from '../../db/schema';

@Injectable()
export class CategoriesRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewCategory): Promise<Category> {
        const result = await this.db.insert(categories).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Category[]> {
        return this.db.select().from(categories);
    }

    async findById(categoryId: string): Promise<Category | undefined> {
        const result = await this.db.select().from(categories).where(eq(categories.categoryId, categoryId));
        return result[0];
    }

    async findBySlug(slug: string): Promise<Category | undefined> {
        const result = await this.db.select().from(categories).where(eq(categories.slug, slug));
        return result[0];
    }

    async findRootCategories(): Promise<Category[]> {
        return this.db.select().from(categories).where(isNull(categories.parentId));
    }

    async findByParentId(parentId: string): Promise<Category[]> {
        return this.db.select().from(categories).where(eq(categories.parentId, parentId));
    }

    async update(categoryId: string, data: Partial<NewCategory>): Promise<Category | undefined> {
        const result = await this.db
            .update(categories)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(categories.categoryId, categoryId))
            .returning();
        return result[0];
    }

    async delete(categoryId: string): Promise<boolean> {
        const result = await this.db.delete(categories).where(eq(categories.categoryId, categoryId)).returning();
        return result.length > 0;
    }
}
