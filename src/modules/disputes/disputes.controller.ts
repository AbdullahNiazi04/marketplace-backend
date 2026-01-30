import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DisputesService } from './disputes.service.js';
import { CreateDisputeDto, UpdateDisputeDto } from './dto/index.js';

@ApiTags('Disputes')
@Controller('disputes')
export class DisputesController {
    constructor(private readonly disputesService: DisputesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new dispute' })
    create(@Body() createDisputeDto: CreateDisputeDto) {
        return this.disputesService.create(createDisputeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all disputes' })
    findAll() {
        return this.disputesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get dispute by ID' })
    findOne(@Param('id') id: string) {
        return this.disputesService.findOne(id);
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Get disputes by order ID' })
    findByOrder(@Param('orderId') orderId: string) {
        return this.disputesService.findByOrder(orderId);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get disputes by user ID' })
    findByUser(@Param('userId') userId: string) {
        return this.disputesService.findByUser(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update dispute' })
    update(@Param('id') id: string, @Body() updateDisputeDto: UpdateDisputeDto) {
        return this.disputesService.update(id, updateDisputeDto);
    }
}
