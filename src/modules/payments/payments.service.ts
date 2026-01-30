import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto';
import { Payment } from '../../db/schema';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly paymentsRepository: PaymentsRepository,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) { }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        await this.ordersService.findOne(createPaymentDto.orderId);

        const existing = await this.paymentsRepository.findByOrderId(createPaymentDto.orderId);
        if (existing) {
            throw new BadRequestException('Payment already exists for this order');
        }

        return this.paymentsRepository.create({
            ...createPaymentDto,
            currency: createPaymentDto.currency || 'USD',
        });
    }

    async findAll(): Promise<Payment[]> {
        return this.paymentsRepository.findAll();
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findById(id);
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }

    async findByOrder(orderId: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findByOrderId(orderId);
        if (!payment) {
            throw new NotFoundException(`Payment for order ${orderId} not found`);
        }
        return payment;
    }

    async updateStatus(id: string, updateDto: UpdatePaymentStatusDto): Promise<Payment> {
        const payment = await this.findOne(id);

        const updateData: any = { status: updateDto.status };
        if (updateDto.transactionRef) {
            updateData.transactionRef = updateDto.transactionRef;
        }

        if (updateDto.status === 'Completed') {
            await this.ordersService.updateStatus(payment.orderId, { status: 'Paid' });
        }

        const updated = await this.paymentsRepository.update(id, updateData);
        return updated!;
    }

    async releaseEscrow(id: string): Promise<Payment> {
        const updated = await this.paymentsRepository.update(id, { escrowStatus: 'Released' });
        return updated!;
    }

    async refund(id: string): Promise<Payment> {
        const payment = await this.findOne(id);
        await this.ordersService.updateStatus(payment.orderId, { status: 'Refunded' });
        const updated = await this.paymentsRepository.update(id, { status: 'Refunded', escrowStatus: 'Refunded' });
        return updated!;
    }
}
