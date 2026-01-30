import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShippingService } from './shipping.service.js';
import { CreateShippingDto, UpdateShippingDto } from './dto/index.js';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new shipment' })
    create(@Body() createShippingDto: CreateShippingDto) {
        return this.shippingService.create(createShippingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all shipments' })
    findAll() {
        return this.shippingService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get shipment by ID' })
    findOne(@Param('id') id: string) {
        return this.shippingService.findOne(id);
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Get shipments by order ID' })
    findByOrder(@Param('orderId') orderId: string) {
        return this.shippingService.findByOrder(orderId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update shipment' })
    update(@Param('id') id: string, @Body() updateShippingDto: UpdateShippingDto) {
        return this.shippingService.update(id, updateShippingDto);
    }

    @Post(':id/delivered')
    @ApiOperation({ summary: 'Mark shipment as delivered' })
    markDelivered(@Param('id') id: string) {
        return this.shippingService.markDelivered(id);
    }
}
