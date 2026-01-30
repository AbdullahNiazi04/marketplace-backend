import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { Order, OrderItem } from '../../db/schema';
import { ListingsService } from '../listings/listings.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        @Inject(forwardRef(() => ListingsService))
        private readonly listingsService: ListingsService,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<{ order: Order; items: OrderItem[] }> {
        let subtotal = 0;
        const orderItems: Array<{ listingId: string; sellerId: string; quantity: number; unitPrice: number; totalPrice: number }> = [];

        for (const item of createOrderDto.items) {
            const listing = await this.listingsService.findOne(item.listingId);

            if (listing.stockQuantity < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${listing.title}`);
            }

            const price = createOrderDto.orderType === 'B2B' && listing.b2bPrice
                ? listing.b2bPrice
                : listing.price;

            const totalPrice = price * item.quantity;
            subtotal += totalPrice;

            orderItems.push({
                listingId: item.listingId,
                sellerId: listing.sellerId,
                quantity: item.quantity,
                unitPrice: price,
                totalPrice,
            });
        }

        const taxAmount = subtotal * 0.1;
        const platformFee = subtotal * 0.05;
        const shippingFee = 10;
        const totalAmount = subtotal + taxAmount + shippingFee;

        const orderNumber = await this.ordersRepository.generateOrderNumber();
        const order = await this.ordersRepository.createOrder({
            orderNumber,
            buyerId: createOrderDto.buyerId,
            companyId: createOrderDto.companyId,
            orderType: createOrderDto.orderType || 'B2C',
            poNumber: createOrderDto.poNumber,
            subtotal,
            taxAmount,
            shippingFee,
            platformFee,
            totalAmount,
            paymentTerms: createOrderDto.paymentTerms || 'Immediate',
            shippingAddress: createOrderDto.shippingAddress,
            billingAddress: createOrderDto.billingAddress,
            notes: createOrderDto.notes,
        });

        const createdItems: OrderItem[] = [];
        for (const item of orderItems) {
            const orderItem = await this.ordersRepository.createOrderItem({
                orderId: order.orderId,
                listingId: item.listingId,
                sellerId: item.sellerId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            });
            createdItems.push(orderItem);
            await this.listingsService.updateStock(item.listingId, -item.quantity);
        }

        return { order, items: createdItems };
    }

    async findAll(limit?: number, offset?: number): Promise<Order[]> {
        return this.ordersRepository.findAll(limit, offset);
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async findByBuyer(buyerId: string): Promise<Order[]> {
        return this.ordersRepository.findByBuyerId(buyerId);
    }

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        await this.findOne(orderId);
        return this.ordersRepository.findOrderItems(orderId);
    }

    async updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<Order> {
        await this.findOne(id);
        const updated = await this.ordersRepository.updateOrder(id, { orderStatus: updateDto.status as any });
        return updated!;
    }
}
