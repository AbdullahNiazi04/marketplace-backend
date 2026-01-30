import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ListingsRepository } from './listings.repository.js';
import { CreateListingDto, UpdateListingDto } from './dto/index.js';
import { Listing } from '../../db/schema/index.js';

@Injectable()
export class ListingsService {
    constructor(private readonly listingsRepository: ListingsRepository) { }

    async create(createListingDto: CreateListingDto): Promise<Listing> {
        if (createListingDto.listingType === 'B2BOnly' && !createListingDto.b2bPrice) {
            throw new BadRequestException('B2B listings require a B2B price');
        }
        return this.listingsRepository.create(createListingDto);
    }

    async findAll(limit?: number, offset?: number): Promise<Listing[]> {
        return this.listingsRepository.findAll(limit, offset);
    }

    async findOne(id: string): Promise<Listing> {
        const listing = await this.listingsRepository.findById(id);
        if (!listing) {
            throw new NotFoundException(`Listing with ID ${id} not found`);
        }
        await this.listingsRepository.incrementViewCount(id);
        return listing;
    }

    async findBySeller(sellerId: string): Promise<Listing[]> {
        return this.listingsRepository.findBySellerId(sellerId);
    }

    async findByCategory(categoryId: string): Promise<Listing[]> {
        return this.listingsRepository.findByCategoryId(categoryId);
    }

    async search(query: string): Promise<Listing[]> {
        return this.listingsRepository.search(query);
    }

    async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing> {
        await this.findOne(id);
        const updated = await this.listingsRepository.update(id, updateListingDto);
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.listingsRepository.update(id, { status: 'Expired' });
    }

    async updateStock(id: string, quantity: number): Promise<Listing> {
        const listing = await this.listingsRepository.findById(id);
        if (!listing) {
            throw new NotFoundException(`Listing with ID ${id} not found`);
        }
        const newStock = listing.stockQuantity + quantity;
        if (newStock < 0) {
            throw new BadRequestException('Insufficient stock');
        }
        const updated = await this.listingsRepository.update(id, { stockQuantity: newStock });
        return updated!;
    }
}
