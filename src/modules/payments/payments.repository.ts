import { Injectable, Inject } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { payments, Payment, NewPayment } from '../../db/schema';

@Injectable()
export class PaymentsRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewPayment): Promise<Payment> {
        const result = await this.db.insert(payments).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Payment[]> {
        return this.db.select().from(payments).orderBy(desc(payments.createdAt));
    }

    async findById(paymentId: string): Promise<Payment | undefined> {
        const result = await this.db.select().from(payments).where(eq(payments.paymentId, paymentId));
        return result[0];
    }

    async findByOrderId(orderId: string): Promise<Payment | undefined> {
        const result = await this.db.select().from(payments).where(eq(payments.orderId, orderId));
        return result[0];
    }

    async update(paymentId: string, data: Partial<NewPayment>): Promise<Payment | undefined> {
        const result = await this.db
            .update(payments)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(payments.paymentId, paymentId))
            .returning();
        return result[0];
    }
}
