import { Injectable, Inject } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { orders, Order, NewOrder, orderItems, OrderItem, NewOrderItem } from '../../db/schema';

@Injectable()
export class OrdersRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async createOrder(data: NewOrder): Promise<Order> {
        const result = await this.db.insert(orders).values(data).returning();
        return result[0];
    }

    async createOrderItem(data: NewOrderItem): Promise<OrderItem> {
        const result = await this.db.insert(orderItems).values(data).returning();
        return result[0];
    }

    async findAll(limit = 50, offset = 0): Promise<Order[]> {
        return this.db.select().from(orders).limit(limit).offset(offset).orderBy(desc(orders.createdAt));
    }

    async findById(orderId: string): Promise<Order | undefined> {
        const result = await this.db.select().from(orders).where(eq(orders.orderId, orderId));
        return result[0];
    }

    async findByBuyerId(buyerId: string): Promise<Order[]> {
        return this.db.select().from(orders).where(eq(orders.buyerId, buyerId)).orderBy(desc(orders.createdAt));
    }

    async findOrderItems(orderId: string): Promise<OrderItem[]> {
        return this.db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    }

    async updateOrder(orderId: string, data: Partial<NewOrder>): Promise<Order | undefined> {
        const result = await this.db
            .update(orders)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(orders.orderId, orderId))
            .returning();
        return result[0];
    }

    async updateOrderItem(itemId: string, data: Partial<NewOrderItem>): Promise<OrderItem | undefined> {
        const result = await this.db
            .update(orderItems)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(orderItems.itemId, itemId))
            .returning();
        return result[0];
    }

    async generateOrderNumber(): Promise<string> {
        const prefix = 'ORD';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
}
