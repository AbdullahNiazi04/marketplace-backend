import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'electronics' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'Electronic devices and gadgets' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    parentId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    sortOrder?: number;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}
