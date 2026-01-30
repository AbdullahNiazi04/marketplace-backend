import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {
    StartConversationDto,
    SendMessageDto,
    GetConversationsQueryDto,
    GetMessagesQueryDto,
    MarkAsReadDto
} from './dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // ==================== Conversation Endpoints ====================

    @Post('conversations')
    @ApiOperation({ summary: 'Start a new conversation or get existing one' })
    startConversation(@Body() dto: StartConversationDto) {
        return this.chatService.startConversation(dto);
    }

    @Get('conversations/user/:userId')
    @ApiOperation({ summary: 'Get all conversations for a user' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    getUserConversations(
        @Param('userId') userId: string,
        @Query() query: GetConversationsQueryDto,
    ) {
        return this.chatService.getUserConversations(userId, query);
    }

    @Get('conversations/:id')
    @ApiOperation({ summary: 'Get a specific conversation' })
    getConversation(@Param('id') id: string) {
        return this.chatService.getConversation(id);
    }

    @Post('conversations/:id/archive')
    @ApiOperation({ summary: 'Archive a conversation' })
    archiveConversation(@Param('id') id: string) {
        return this.chatService.archiveConversation(id);
    }

    // ==================== Message Endpoints ====================

    @Post('messages')
    @ApiOperation({ summary: 'Send a new message' })
    sendMessage(@Body() dto: SendMessageDto) {
        return this.chatService.sendMessage(dto);
    }

    @Get('conversations/:id/messages')
    @ApiOperation({ summary: 'Get messages in a conversation' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'before', required: false, description: 'Message ID for cursor pagination' })
    @ApiQuery({ name: 'after', required: false })
    getMessages(
        @Param('id') id: string,
        @Query() query: GetMessagesQueryDto,
    ) {
        return this.chatService.getMessages(id, query);
    }

    @Post('conversations/:id/read')
    @ApiOperation({ summary: 'Mark all messages in conversation as read' })
    markAsRead(
        @Param('id') id: string,
        @Body() dto: MarkAsReadDto,
    ) {
        return this.chatService.markAsRead(id, dto.userId);
    }

    // ==================== Utility Endpoints ====================

    @Get('unread/:userId')
    @ApiOperation({ summary: 'Get total unread message count for a user' })
    getUnreadCount(@Param('userId') userId: string) {
        return this.chatService.getUnreadCount(userId);
    }
}
