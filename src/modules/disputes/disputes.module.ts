import { Module } from '@nestjs/common';
import { DisputesController } from './disputes.controller.js';
import { DisputesService } from './disputes.service.js';
import { DisputesRepository } from './disputes.repository.js';

@Module({
    controllers: [DisputesController],
    providers: [DisputesService, DisputesRepository],
    exports: [DisputesService],
})
export class DisputesModule { }
