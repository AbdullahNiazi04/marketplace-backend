import { IsString, IsOptional, IsEnum, IsNumber, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiProperty({ example: 99.99 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiPropertyOptional({ default: 'USD' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ example: 'Card' })
    @IsString()
    paymentMethod: string;

    @ApiProperty({ example: 'Stripe' })
    @IsString()
    paymentProvider: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class UpdatePaymentStatusDto {
    @ApiProperty({ example: 'Completed' })
    @IsString()
    status: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    transactionRef?: string;
}
