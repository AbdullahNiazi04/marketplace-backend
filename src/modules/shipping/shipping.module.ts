import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller.js';
import { ShippingService } from './shipping.service.js';
import { ShippingRepository } from './shipping.repository.js';

@Module({
    controllers: [ShippingController],
    providers: [ShippingService, ShippingRepository],
    exports: [ShippingService],
})
export class ShippingModule { }
