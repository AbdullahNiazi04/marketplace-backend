import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { ChatRepository } from './chat.repository.js';
import { ChatGateway } from './chat.gateway.js';

@Module({
    controllers: [ChatController],
    providers: [ChatService, ChatRepository, ChatGateway],
    exports: [ChatService],
})
export class ChatModule { }
