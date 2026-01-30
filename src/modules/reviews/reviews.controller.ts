import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, SellerResponseDto } from './dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new review' })
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(createReviewDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get review by ID' })
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Get reviews for a product' })
    findByProduct(@Param('productId') productId: string) {
        return this.reviewsService.findByProduct(productId);
    }

    @Get('seller/:sellerId')
    @ApiOperation({ summary: 'Get reviews for a seller' })
    findBySeller(@Param('sellerId') sellerId: string) {
        return this.reviewsService.findBySeller(sellerId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update review' })
    update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewsService.update(id, updateReviewDto);
    }

    @Post(':id/response')
    @ApiOperation({ summary: 'Add seller response to review' })
    addSellerResponse(@Param('id') id: string, @Body() responseDto: SellerResponseDto) {
        return this.reviewsService.addSellerResponse(id, responseDto);
    }

    @Post(':id/helpful')
    @ApiOperation({ summary: 'Mark review as helpful' })
    markHelpful(@Param('id') id: string) {
        return this.reviewsService.markHelpful(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete review' })
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}
