import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { shippingStatusEnum } from '../../../db/schema/shipping.schema.js';

export class CreateShippingDto {
    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderItemId?: string;

    @ApiProperty({ example: 'FedEx' })
    @IsString()
    carrierName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiProperty({ example: 10.00 })
    @IsNumber()
    @Min(0)
    shippingCost: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    signatureRequired?: boolean;
}

export class UpdateShippingDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({ enum: shippingStatusEnum })
    @IsOptional()
    @IsEnum(shippingStatusEnum)
    status?: typeof shippingStatusEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    carrierName?: string;
}
