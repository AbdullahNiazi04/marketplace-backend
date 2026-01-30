import { IsString, IsOptional, IsEnum, IsNumber, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { reviewTargetTypeEnum } from '../../../db/schema/reviews.schema.js';

export class CreateReviewDto {
    @ApiProperty({ enum: reviewTargetTypeEnum })
    @IsEnum(reviewTargetTypeEnum)
    targetType: typeof reviewTargetTypeEnum[number];

    @ApiProperty({ description: 'ID of Product or Seller' })
    @IsString()
    targetId: string;

    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiProperty()
    @IsString()
    authorId: string;

    @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({ example: 'Great product!' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'Exactly as described, fast shipping' })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    mediaUrls?: string[];
}

export class UpdateReviewDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    comment?: string;
}

export class SellerResponseDto {
    @ApiProperty()
    @IsString()
    response: string;
}
