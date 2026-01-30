import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { WsSendMessageDto, WsTypingDto, WsMarkReadDto } from './dto';

/**
 * Chat WebSocket Gateway
 * 
 * Handles real-time messaging between buyers and sellers.
 * 
 * Events:
 * - join: User joins their personal room
 * - sendMessage: Send a new message
 * - typing: Broadcast typing indicator
 * - markRead: Mark messages as read
 * - leaveConversation: Leave a conversation room
 * 
 * Scalability Notes:
 * - Each user joins their own room (user-{userId})
 * - Messages are emitted to recipient's room
 * - For horizontal scaling, use Redis adapter
 */
@WebSocketGateway({
    cors: {
        origin: '*', // Configure in production
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(ChatGateway.name);
    private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

    constructor(private readonly chatService: ChatService) { }

    // ==================== Connection Lifecycle ====================

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Clean up user socket mapping
        for (const [userId, sockets] of this.userSockets.entries()) {
            if (sockets.has(client.id)) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.userSockets.delete(userId);
                }
                break;
            }
        }
    }

    // ==================== Event Handlers ====================

    /**
     * User joins their personal room for receiving messages
     */
    @SubscribeMessage('join')
    handleJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: string,
    ) {
        const room = `user-${userId}`;
        client.join(room);

        // Track socket for this user (supports multiple tabs/devices)
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId)!.add(client.id);

        this.logger.log(`User ${userId} joined room ${room}`);

        return { event: 'joined', data: { room, userId } };
    }

    /**
     * Join a specific conversation room (for typing indicators)
     */
    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: string,
    ) {
        const room = `conversation-${conversationId}`;
        client.join(room);
        return { event: 'joinedConversation', data: { conversationId } };
    }

    /**
     * Leave a conversation room
     */
    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: string,
    ) {
        const room = `conversation-${conversationId}`;
        client.leave(room);
        return { event: 'leftConversation', data: { conversationId } };
    }

    /**
     * Send a new message
     */
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WsSendMessageDto,
    ) {
        try {
            // Save message to database
            const message = await this.chatService.sendMessage({
                conversationId: payload.conversationId,
                senderId: payload.senderId,
                content: payload.content,
                messageType: payload.messageType,
                attachmentUrl: payload.attachmentUrl,
                replyToMessageId: payload.replyToMessageId,
            });

            // Get recipient ID
            const recipientId = await this.chatService.getRecipientId(
                payload.conversationId,
                payload.senderId
            );

            // Emit to recipient's room
            this.server.to(`user-${recipientId}`).emit('newMessage', {
                message,
                conversationId: payload.conversationId,
            });

            // Also emit to sender (for multi-device sync)
            this.server.to(`user-${payload.senderId}`).emit('messageSent', {
                message,
                conversationId: payload.conversationId,
            });

            return { event: 'messageSent', data: message };
        } catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            return { event: 'error', data: { message: error.message } };
        }
    }

    /**
     * Broadcast typing indicator
     */
    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WsTypingDto,
    ) {
        try {
            const recipientId = await this.chatService.getRecipientId(
                payload.conversationId,
                payload.userId
            );

            // Emit typing status to recipient
            this.server.to(`user-${recipientId}`).emit('userTyping', {
                conversationId: payload.conversationId,
                userId: payload.userId,
                isTyping: payload.isTyping,
            });

            return { event: 'typingBroadcast', data: payload };
        } catch (error) {
            return { event: 'error', data: { message: error.message } };
        }
    }

    /**
     * Mark messages as read
     */
    @SubscribeMessage('markRead')
    async handleMarkRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WsMarkReadDto,
    ) {
        try {
            await this.chatService.markAsRead(payload.conversationId, payload.userId);

            // Notify sender that messages were read
            const recipientId = await this.chatService.getRecipientId(
                payload.conversationId,
                payload.userId
            );

            this.server.to(`user-${recipientId}`).emit('messagesRead', {
                conversationId: payload.conversationId,
                readBy: payload.userId,
            });

            return { event: 'markedRead', data: payload };
        } catch (error) {
            return { event: 'error', data: { message: error.message } };
        }
    }

    // ==================== Utility Methods ====================

    /**
     * Check if a user is online
     */
    isUserOnline(userId: string): boolean {
        return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
    }

    /**
     * Get online users count
     */
    getOnlineUsersCount(): number {
        return this.userSockets.size;
    }
}
