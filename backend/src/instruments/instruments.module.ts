import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service.js';
import { InstrumentsController } from './instruments.controller.js';

@Module({
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
})
export class InstrumentsModule {}
