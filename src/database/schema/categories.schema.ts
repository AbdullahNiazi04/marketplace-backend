import { pgTable, text, boolean, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const categories = pgTable('categories', {
    categoryId: uuid('category_id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentId: uuid('parent_id').references((): any => categories.categoryId),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
