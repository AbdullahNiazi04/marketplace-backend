import { IsString, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { messageTypeEnum } from '../../../db/schema/messages.schema';

// ==================== Conversation DTOs ====================

export class StartConversationDto {
    @ApiProperty({ description: 'ID of the seller to chat with' })
    @IsString()
    sellerId: string;

    @ApiProperty({ description: 'ID of the buyer starting the conversation' })
    @IsString()
    buyerId: string;

    @ApiPropertyOptional({ description: 'Optional listing ID to link conversation to a product' })
    @IsOptional()
    @IsString()
    listingId?: string;

    @ApiPropertyOptional({ description: 'Initial message content' })
    @IsOptional()
    @IsString()
    initialMessage?: string;
}

export class GetConversationsQueryDto {
    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;
}

// ==================== Message DTOs ====================

export class SendMessageDto {
    @ApiProperty({ description: 'Conversation ID' })
    @IsString()
    conversationId: string;

    @ApiProperty({ description: 'Sender user ID' })
    @IsString()
    senderId: string;

    @ApiProperty({ description: 'Message content' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ enum: messageTypeEnum, default: 'Text' })
    @IsOptional()
    @IsEnum(messageTypeEnum)
    messageType?: typeof messageTypeEnum[number];

    @ApiPropertyOptional({ description: 'Attachment URL for Image/File messages' })
    @IsOptional()
    @IsString()
    attachmentUrl?: string;

    @ApiPropertyOptional({ description: 'Original file name' })
    @IsOptional()
    @IsString()
    attachmentName?: string;

    @ApiPropertyOptional({ description: 'File size in bytes' })
    @IsOptional()
    @IsNumber()
    attachmentSize?: number;

    @ApiPropertyOptional({ description: 'ID of message being replied to' })
    @IsOptional()
    @IsString()
    replyToMessageId?: string;
}

export class GetMessagesQueryDto {
    @ApiPropertyOptional({ default: 50 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ description: 'Cursor for pagination (message ID)' })
    @IsOptional()
    @IsString()
    before?: string;

    @ApiPropertyOptional({ description: 'Get messages after this ID' })
    @IsOptional()
    @IsString()
    after?: string;
}

export class MarkAsReadDto {
    @ApiProperty({ description: 'User ID marking messages as read' })
    @IsString()
    userId: string;
}

// ==================== WebSocket Event DTOs ====================

export class WsJoinDto {
    userId: string;
}

export class WsSendMessageDto {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: typeof messageTypeEnum[number];
    attachmentUrl?: string;
    replyToMessageId?: string;
}

export class WsTypingDto {
    conversationId: string;
    userId: string;
    isTyping: boolean;
}

export class WsMarkReadDto {
    conversationId: string;
    userId: string;
}
