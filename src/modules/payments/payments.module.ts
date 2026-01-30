import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsRepository } from './payments.repository.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentsRepository],
    exports: [PaymentsService],
})
export class PaymentsModule { }
