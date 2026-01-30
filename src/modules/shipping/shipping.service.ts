import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingRepository } from './shipping.repository';
import { CreateShippingDto, UpdateShippingDto } from './dto';
import { Shipping } from '../../db/schema';

@Injectable()
export class ShippingService {
    constructor(private readonly shippingRepository: ShippingRepository) { }

    async create(createShippingDto: CreateShippingDto): Promise<Shipping> {
        return this.shippingRepository.create(createShippingDto);
    }

    async findAll(): Promise<Shipping[]> {
        return this.shippingRepository.findAll();
    }

    async findOne(id: string): Promise<Shipping> {
        const shipment = await this.shippingRepository.findById(id);
        if (!shipment) {
            throw new NotFoundException(`Shipping with ID ${id} not found`);
        }
        return shipment;
    }

    async findByOrder(orderId: string): Promise<Shipping[]> {
        return this.shippingRepository.findByOrderId(orderId);
    }

    async update(id: string, updateShippingDto: UpdateShippingDto): Promise<Shipping> {
        await this.findOne(id);
        const updated = await this.shippingRepository.update(id, updateShippingDto);
        return updated!;
    }

    async markDelivered(id: string): Promise<Shipping> {
        const updated = await this.shippingRepository.update(id, {
            status: 'Delivered',
            actualDelivery: new Date(),
        });
        return updated!;
    }
}
