import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import {
    StartConversationDto,
    SendMessageDto,
    GetConversationsQueryDto,
    GetMessagesQueryDto
} from './dto';
import { Conversation, Message } from '../../db/schema';

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository) { }

    // ==================== Conversation Methods ====================

    async startConversation(dto: StartConversationDto): Promise<{ conversation: Conversation; message?: Message }> {
        // Check if conversation already exists
        let conversation = await this.chatRepository.findConversationByParticipants(
            dto.buyerId,
            dto.sellerId,
            dto.listingId
        );

        if (!conversation) {
            // Create new conversation
            conversation = await this.chatRepository.createConversation({
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                listingId: dto.listingId,
            });
        }

        // Send initial message if provided
        let message: Message | undefined;
        if (dto.initialMessage) {
            message = await this.sendMessage({
                conversationId: conversation.conversationId,
                senderId: dto.buyerId,
                content: dto.initialMessage,
            });
        }

        return { conversation, message };
    }

    async getConversation(conversationId: string): Promise<Conversation> {
        const conversation = await this.chatRepository.findConversationById(conversationId);
        if (!conversation) {
            throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
        }
        return conversation;
    }

    async getUserConversations(userId: string, query: GetConversationsQueryDto): Promise<Conversation[]> {
        return this.chatRepository.findConversationsByUserId(
            userId,
            query.limit || 20,
            query.offset || 0
        );
    }

    async archiveConversation(conversationId: string): Promise<Conversation> {
        await this.getConversation(conversationId);
        const updated = await this.chatRepository.updateConversation(conversationId, { status: 'Archived' });
        return updated!;
    }

    // ==================== Message Methods ====================

    async sendMessage(dto: SendMessageDto): Promise<Message> {
        // Verify conversation exists
        const conversation = await this.getConversation(dto.conversationId);

        // Verify sender is a participant
        if (dto.senderId !== conversation.buyerId && dto.senderId !== conversation.sellerId) {
            throw new BadRequestException('Sender is not a participant in this conversation');
        }

        // Create message
        const message = await this.chatRepository.createMessage({
            conversationId: dto.conversationId,
            senderId: dto.senderId,
            content: dto.content,
            messageType: dto.messageType || 'Text',
            attachmentUrl: dto.attachmentUrl,
            attachmentName: dto.attachmentName,
            attachmentSize: dto.attachmentSize,
            replyToMessageId: dto.replyToMessageId,
        });

        // Update conversation with last message info
        const isSenderBuyer = dto.senderId === conversation.buyerId;
        await this.chatRepository.updateConversation(dto.conversationId, {
            lastMessagePreview: dto.content.substring(0, 100),
            lastMessageAt: new Date(),
        });

        // Increment unread count for recipient
        await this.chatRepository.incrementUnreadCount(dto.conversationId, !isSenderBuyer);

        return message;
    }

    async getMessages(conversationId: string, query: GetMessagesQueryDto): Promise<Message[]> {
        await this.getConversation(conversationId);
        return this.chatRepository.findMessagesByConversationId(
            conversationId,
            query.limit || 50,
            query.before,
            query.after
        );
    }

    async markAsRead(conversationId: string, userId: string): Promise<void> {
        const conversation = await this.getConversation(conversationId);

        // Mark messages as read
        await this.chatRepository.markMessagesAsRead(conversationId, userId);

        // Reset unread count
        const isBuyer = userId === conversation.buyerId;
        await this.chatRepository.resetUnreadCount(conversationId, isBuyer);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.chatRepository.getUnreadCount(userId);
    }

    // ==================== Helper Methods ====================

    async getRecipientId(conversationId: string, senderId: string): Promise<string> {
        const conversation = await this.getConversation(conversationId);
        return senderId === conversation.buyerId ? conversation.sellerId : conversation.buyerId;
    }
}
