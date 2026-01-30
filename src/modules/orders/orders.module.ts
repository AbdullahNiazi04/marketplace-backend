import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrdersRepository } from './orders.repository.js';
import { ListingsModule } from '../listings/listings.module.js';

@Module({
    imports: [forwardRef(() => ListingsModule)],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule { }
