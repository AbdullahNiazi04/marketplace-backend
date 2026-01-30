import { IsEmail, IsString, IsOptional, IsEnum, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userTypeEnum, userRoleEnum } from '../../../db/schema/users.schema.js';

export class CreateUserDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    fullName: string;

    @ApiPropertyOptional({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ enum: userTypeEnum, default: 'Individual' })
    @IsOptional()
    @IsEnum(userTypeEnum)
    userType?: typeof userTypeEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyId?: string;

    @ApiPropertyOptional({ enum: userRoleEnum, default: 'Buyer' })
    @IsOptional()
    @IsEnum(userRoleEnum)
    role?: typeof userRoleEnum[number];
}
