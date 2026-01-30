import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { disputeReasonEnum, disputeStatusEnum, disputeResolutionEnum } from '../../../db/schema/disputes.schema';

export class CreateDisputeDto {
    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiProperty()
    @IsString()
    raisedBy: string;

    @ApiProperty()
    @IsString()
    against: string;

    @ApiProperty({ enum: disputeReasonEnum })
    @IsEnum(disputeReasonEnum)
    reasonCode: typeof disputeReasonEnum[number];

    @ApiProperty({ example: 'Item not received after 14 days' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    evidenceUrls?: string[];
}

export class UpdateDisputeDto {
    @ApiPropertyOptional({ enum: disputeStatusEnum })
    @IsOptional()
    @IsEnum(disputeStatusEnum)
    status?: typeof disputeStatusEnum[number];

    @ApiPropertyOptional({ enum: disputeResolutionEnum })
    @IsOptional()
    @IsEnum(disputeResolutionEnum)
    resolution?: typeof disputeResolutionEnum[number];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    resolutionNotes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    resolvedBy?: string;
}
