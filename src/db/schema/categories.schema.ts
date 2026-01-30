import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
    categoryId: text('category_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentId: text('parent_id').references((): any => categories.categoryId),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
