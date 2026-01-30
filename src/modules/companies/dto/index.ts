import { IsString, IsOptional, IsEnum, IsNumber, IsObject, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { businessTypeEnum, paymentTermsEnum } from '../../../db/schema/companies.schema.js';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Acme Corporation' })
    @IsString()
    companyName: string;

    @ApiPropertyOptional({ example: 'Acme Corp' })
    @IsOptional()
    @IsString()
    tradingName?: string;

    @ApiProperty({ example: '12-3456789' })
    @IsString()
    taxId: string;

    @ApiProperty({ enum: businessTypeEnum })
    @IsEnum(businessTypeEnum)
    businessType: typeof businessTypeEnum[number];

    @ApiProperty({ example: 'Manufacturing' })
    @IsString()
    industry: string;

    @ApiProperty({ example: { street: '123 Business Ave', city: 'New York', state: 'NY', zip: '10001', country: 'USA' } })
    @IsObject()
    address: Record<string, any>;

    @ApiProperty({ example: 'contact@acme.com' })
    @IsEmail()
    contactEmail: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    contactPhone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminUserId?: string;
}

export class UpdateCompanyDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tradingName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    address?: Record<string, any>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiPropertyOptional({ enum: paymentTermsEnum })
    @IsOptional()
    @IsEnum(paymentTermsEnum)
    paymentTerms?: typeof paymentTermsEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    creditLimit?: number;
}
