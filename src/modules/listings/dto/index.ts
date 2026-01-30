import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { listingTypeEnum, customerTypeEnum } from '../../../db/schema/listings.schema.js';

export class CreateListingDto {
    @ApiProperty()
    @IsString()
    sellerId: string;

    @ApiProperty()
    @IsString()
    categoryId: string;

    @ApiProperty({ example: 'Premium Wireless Headphones' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'High-quality wireless headphones with noise cancellation' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ enum: listingTypeEnum, default: 'Fixed' })
    @IsOptional()
    @IsEnum(listingTypeEnum)
    listingType?: typeof listingTypeEnum[number];

    @ApiPropertyOptional({ enum: customerTypeEnum, default: 'Both' })
    @IsOptional()
    @IsEnum(customerTypeEnum)
    customerType?: typeof customerTypeEnum[number];

    @ApiProperty({ example: 99.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 79.99, description: 'Wholesale price for B2B' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    b2bPrice?: number;

    @ApiPropertyOptional({ example: 10, description: 'Minimum order quantity for B2B' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    minOrderQty?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @ApiPropertyOptional({ example: 0.5, description: 'Weight in kg' })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiPropertyOptional({ example: { length: 20, width: 15, height: 10 } })
    @IsOptional()
    @IsObject()
    dimensions?: Record<string, number>;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    mediaUrls?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    specifications?: Record<string, any>;
}

export class UpdateListingDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    b2bPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    mediaUrls?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    specifications?: Record<string, any>;
}
