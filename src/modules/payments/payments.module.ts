import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentsRepository],
    exports: [PaymentsService],
})
export class PaymentsModule { }
