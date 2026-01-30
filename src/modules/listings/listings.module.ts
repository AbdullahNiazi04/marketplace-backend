import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller.js';
import { ListingsService } from './listings.service.js';
import { ListingsRepository } from './listings.repository.js';

@Module({
    controllers: [ListingsController],
    providers: [ListingsService, ListingsRepository],
    exports: [ListingsService],
})
export class ListingsModule { }
