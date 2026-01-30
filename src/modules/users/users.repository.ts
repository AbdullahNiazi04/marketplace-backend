import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { users, User, NewUser } from '../../db/schema';

@Injectable()
export class UsersRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: any,
    ) { }

    async create(data: NewUser): Promise<User> {
        const result = await this.db.insert(users).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<User[]> {
        return this.db.select().from(users);
    }

    async findById(userId: string): Promise<User | undefined> {
        const result = await this.db.select().from(users).where(eq(users.userId, userId));
        return result[0];
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const result = await this.db.select().from(users).where(eq(users.email, email));
        return result[0];
    }

    async update(userId: string, data: Partial<NewUser>): Promise<User | undefined> {
        const result = await this.db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.userId, userId))
            .returning();
        return result[0];
    }

    async delete(userId: string): Promise<boolean> {
        const result = await this.db.delete(users).where(eq(users.userId, userId)).returning();
        return result.length > 0;
    }

    async softDelete(userId: string): Promise<User | undefined> {
        return this.update(userId, { isActive: false });
    }
}
