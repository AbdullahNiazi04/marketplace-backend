import { Injectable, Inject } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import { disputes, Dispute, NewDispute } from '../../db/schema/index.js';

@Injectable()
export class DisputesRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewDispute): Promise<Dispute> {
        const result = await this.db.insert(disputes).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Dispute[]> {
        return this.db.select().from(disputes).orderBy(desc(disputes.createdAt));
    }

    async findById(disputeId: string): Promise<Dispute | undefined> {
        const result = await this.db.select().from(disputes).where(eq(disputes.disputeId, disputeId));
        return result[0];
    }

    async findByOrderId(orderId: string): Promise<Dispute[]> {
        return this.db.select().from(disputes).where(eq(disputes.orderId, orderId));
    }

    async findByUserId(userId: string): Promise<Dispute[]> {
        return this.db.select().from(disputes).where(eq(disputes.raisedBy, userId));
    }

    async update(disputeId: string, data: Partial<NewDispute>): Promise<Dispute | undefined> {
        const result = await this.db
            .update(disputes)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(disputes.disputeId, disputeId))
            .returning();
        return result[0];
    }
}
