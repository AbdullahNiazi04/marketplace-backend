import { Injectable, NotFoundException } from '@nestjs/common';
import { DisputesRepository } from './disputes.repository';
import { CreateDisputeDto, UpdateDisputeDto } from './dto';
import { Dispute } from '../../db/schema';

@Injectable()
export class DisputesService {
    constructor(private readonly disputesRepository: DisputesRepository) { }

    async create(createDisputeDto: CreateDisputeDto): Promise<Dispute> {
        const responseDeadline = new Date();
        responseDeadline.setHours(responseDeadline.getHours() + 72);

        return this.disputesRepository.create({
            ...createDisputeDto,
            responseDeadline,
        });
    }

    async findAll(): Promise<Dispute[]> {
        return this.disputesRepository.findAll();
    }

    async findOne(id: string): Promise<Dispute> {
        const dispute = await this.disputesRepository.findById(id);
        if (!dispute) {
            throw new NotFoundException(`Dispute with ID ${id} not found`);
        }
        return dispute;
    }

    async findByOrder(orderId: string): Promise<Dispute[]> {
        return this.disputesRepository.findByOrderId(orderId);
    }

    async findByUser(userId: string): Promise<Dispute[]> {
        return this.disputesRepository.findByUserId(userId);
    }

    async update(id: string, updateDisputeDto: UpdateDisputeDto): Promise<Dispute> {
        await this.findOne(id);
        const updated = await this.disputesRepository.update(id, updateDisputeDto);
        return updated!;
    }

    async resolve(id: string, resolution: string, resolvedBy: string, notes?: string): Promise<Dispute> {
        const updated = await this.disputesRepository.update(id, {
            status: 'Resolved',
            resolution: resolution as any,
            resolvedBy,
            resolutionNotes: notes,
            resolvedAt: new Date(),
        });
        return updated!;
    }
}
