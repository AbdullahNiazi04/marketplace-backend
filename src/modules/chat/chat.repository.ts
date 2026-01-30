import { Injectable, Inject } from '@nestjs/common';
import { eq, desc, and, or, lt, gt, sql, SQL } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import {
    conversations, Conversation, NewConversation,
    messages, Message, NewMessage
} from '../../db/schema/index.js';

@Injectable()
export class ChatRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    // ==================== Conversation Methods ====================

    async createConversation(data: NewConversation): Promise<Conversation> {
        const result = await this.db.insert(conversations).values(data).returning();
        return result[0];
    }

    async findConversationById(conversationId: string): Promise<Conversation | undefined> {
        const result = await this.db.select().from(conversations)
            .where(eq(conversations.conversationId, conversationId));
        return result[0];
    }

    async findConversationByParticipants(
        buyerId: string,
        sellerId: string,
        listingId?: string
    ): Promise<Conversation | undefined> {
        const conditions: SQL[] = [
            eq(conversations.buyerId, buyerId),
            eq(conversations.sellerId, sellerId)
        ];

        if (listingId) {
            conditions.push(eq(conversations.listingId, listingId));
        }

        const result = await this.db.select().from(conversations).where(and(...conditions));
        return result[0];
    }

    async findConversationsByUserId(userId: string, limit = 20, offset = 0): Promise<Conversation[]> {
        return this.db.select().from(conversations)
            .where(or(
                eq(conversations.buyerId, userId),
                eq(conversations.sellerId, userId)
            ))
            .orderBy(desc(conversations.lastMessageAt))
            .limit(limit)
            .offset(offset);
    }

    async updateConversation(conversationId: string, data: Partial<NewConversation>): Promise<Conversation | undefined> {
        const result = await this.db.update(conversations)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(conversations.conversationId, conversationId))
            .returning();
        return result[0];
    }

    async incrementUnreadCount(conversationId: string, forBuyer: boolean): Promise<void> {
        if (forBuyer) {
            await this.db.update(conversations)
                .set({ buyerUnreadCount: sql`${conversations.buyerUnreadCount} + 1` })
                .where(eq(conversations.conversationId, conversationId));
        } else {
            await this.db.update(conversations)
                .set({ sellerUnreadCount: sql`${conversations.sellerUnreadCount} + 1` })
                .where(eq(conversations.conversationId, conversationId));
        }
    }

    async resetUnreadCount(conversationId: string, forBuyer: boolean): Promise<void> {
        if (forBuyer) {
            await this.db.update(conversations)
                .set({ buyerUnreadCount: 0 })
                .where(eq(conversations.conversationId, conversationId));
        } else {
            await this.db.update(conversations)
                .set({ sellerUnreadCount: 0 })
                .where(eq(conversations.conversationId, conversationId));
        }
    }

    // ==================== Message Methods ====================

    async createMessage(data: NewMessage): Promise<Message> {
        const result = await this.db.insert(messages).values(data).returning();
        return result[0];
    }

    async findMessageById(messageId: string): Promise<Message | undefined> {
        const result = await this.db.select().from(messages)
            .where(eq(messages.messageId, messageId));
        return result[0];
    }

    async findMessagesByConversationId(
        conversationId: string,
        limit = 50,
        before?: string,
        after?: string
    ): Promise<Message[]> {
        const conditions: SQL[] = [eq(messages.conversationId, conversationId)];

        if (before) {
            const beforeMessage = await this.findMessageById(before);
            if (beforeMessage) {
                conditions.push(lt(messages.createdAt, beforeMessage.createdAt));
            }
        }

        if (after) {
            const afterMessage = await this.findMessageById(after);
            if (afterMessage) {
                conditions.push(gt(messages.createdAt, afterMessage.createdAt));
            }
        }

        return this.db.select().from(messages)
            .where(and(...conditions))
            .orderBy(desc(messages.createdAt))
            .limit(limit);
    }

    async updateMessage(messageId: string, data: Partial<NewMessage>): Promise<Message | undefined> {
        const result = await this.db.update(messages)
            .set(data)
            .where(eq(messages.messageId, messageId))
            .returning();
        return result[0];
    }

    async markMessagesAsRead(conversationId: string, recipientId: string): Promise<void> {
        await this.db.update(messages)
            .set({ status: 'Read' })
            .where(and(
                eq(messages.conversationId, conversationId),
                sql`${messages.senderId} != ${recipientId}`,
                sql`${messages.status} != 'Read'`
            ));
    }

    async getUnreadCount(userId: string): Promise<number> {
        const buyerResult = await this.db.select({
            total: sql`SUM(${conversations.buyerUnreadCount})`
        })
            .from(conversations)
            .where(eq(conversations.buyerId, userId));

        const sellerResult = await this.db.select({
            total: sql`SUM(${conversations.sellerUnreadCount})`
        })
            .from(conversations)
            .where(eq(conversations.sellerId, userId));

        return (buyerResult[0]?.total || 0) + (sellerResult[0]?.total || 0);
    }
}
