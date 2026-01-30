import { Injectable, Inject } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import { shipping, Shipping, NewShipping } from '../../db/schema/index.js';

@Injectable()
export class ShippingRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewShipping): Promise<Shipping> {
        const result = await this.db.insert(shipping).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Shipping[]> {
        return this.db.select().from(shipping).orderBy(desc(shipping.createdAt));
    }

    async findById(shippingId: string): Promise<Shipping | undefined> {
        const result = await this.db.select().from(shipping).where(eq(shipping.shippingId, shippingId));
        return result[0];
    }

    async findByOrderId(orderId: string): Promise<Shipping[]> {
        return this.db.select().from(shipping).where(eq(shipping.orderId, orderId));
    }

    async update(shippingId: string, data: Partial<NewShipping>): Promise<Shipping | undefined> {
        const result = await this.db
            .update(shipping)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(shipping.shippingId, shippingId))
            .returning();
        return result[0];
    }
}
