import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { ListingsModule } from '../listings/listings.module';

@Module({
    imports: [forwardRef(() => ListingsModule)],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule { }
