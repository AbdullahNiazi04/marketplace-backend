import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/index.js';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new payment' })
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all payments' })
    findAll() {
        return this.paymentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get payment by ID' })
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Get payment by order ID' })
    findByOrder(@Param('orderId') orderId: string) {
        return this.paymentsService.findByOrder(orderId);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update payment status' })
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdatePaymentStatusDto) {
        return this.paymentsService.updateStatus(id, updateDto);
    }

    @Post(':id/release-escrow')
    @ApiOperation({ summary: 'Release escrow funds' })
    releaseEscrow(@Param('id') id: string) {
        return this.paymentsService.releaseEscrow(id);
    }

    @Post(':id/refund')
    @ApiOperation({ summary: 'Refund payment' })
    refund(@Param('id') id: string) {
        return this.paymentsService.refund(id);
    }
}
