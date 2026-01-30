import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository.js';
import { CreateReviewDto, UpdateReviewDto, SellerResponseDto } from './dto/index.js';
import { Review } from '../../db/schema/index.js';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepository: ReviewsRepository) { }

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        return this.reviewsRepository.create(createReviewDto);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewsRepository.findAll();
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findById(id);
        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }

    async findByProduct(productId: string): Promise<Review[]> {
        return this.reviewsRepository.findByTarget('Product', productId);
    }

    async findBySeller(sellerId: string): Promise<Review[]> {
        return this.reviewsRepository.findByTarget('Seller', sellerId);
    }

    async findByAuthor(authorId: string): Promise<Review[]> {
        return this.reviewsRepository.findByAuthor(authorId);
    }

    async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        await this.findOne(id);
        const updated = await this.reviewsRepository.update(id, updateReviewDto);
        return updated!;
    }

    async addSellerResponse(id: string, responseDto: SellerResponseDto): Promise<Review> {
        await this.findOne(id);
        const updated = await this.reviewsRepository.update(id, {
            sellerResponse: responseDto.response,
            sellerResponseAt: new Date(),
        });
        return updated!;
    }

    async markHelpful(id: string): Promise<Review> {
        const review = await this.findOne(id);
        const updated = await this.reviewsRepository.update(id, {
            helpfulCount: (review.helpfulCount || 0) + 1,
        });
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.reviewsRepository.delete(id);
    }
}
