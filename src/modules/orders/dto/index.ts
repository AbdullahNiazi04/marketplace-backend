import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { orderTypeEnum, orderPaymentTermsEnum } from '../../../db/schema/orders.schema';

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    buyerId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyId?: string;

    @ApiPropertyOptional({ enum: orderTypeEnum, default: 'B2C' })
    @IsOptional()
    @IsEnum(orderTypeEnum)
    orderType?: typeof orderTypeEnum[number];

    @ApiPropertyOptional({ description: 'B2B Purchase Order number' })
    @IsOptional()
    @IsString()
    poNumber?: string;

    @ApiProperty({ type: [Object], description: 'Array of { listingId, quantity }' })
    @IsArray()
    items: Array<{ listingId: string; quantity: number }>;

    @ApiProperty()
    @IsObject()
    shippingAddress: Record<string, any>;

    @ApiProperty()
    @IsObject()
    billingAddress: Record<string, any>;

    @ApiPropertyOptional({ enum: orderPaymentTermsEnum })
    @IsOptional()
    @IsEnum(orderPaymentTermsEnum)
    paymentTerms?: typeof orderPaymentTermsEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateOrderStatusDto {
    @ApiProperty({ example: 'Paid' })
    @IsString()
    status: string;
}
