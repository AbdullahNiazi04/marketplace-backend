import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/index.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.ordersService.findAll(limit, offset);
    }

    @Get('buyer/:buyerId')
    @ApiOperation({ summary: 'Get orders by buyer' })
    findByBuyer(@Param('buyerId') buyerId: string) {
        return this.ordersService.findByBuyer(buyerId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Get(':id/items')
    @ApiOperation({ summary: 'Get order items' })
    getItems(@Param('id') id: string) {
        return this.ordersService.getOrderItems(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, updateDto);
    }
}
