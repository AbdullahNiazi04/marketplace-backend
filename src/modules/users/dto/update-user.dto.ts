import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { verificationStatusEnum } from '../../../db/schema/users.schema.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @ApiPropertyOptional({ enum: verificationStatusEnum })
    @IsOptional()
    @IsEnum(verificationStatusEnum)
    verificationStatus?: typeof verificationStatusEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
