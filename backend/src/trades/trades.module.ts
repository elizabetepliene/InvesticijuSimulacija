import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller.js';
import { TradesService } from './trades.service.js';
import { InstrumentsModule } from '../instruments/instruments.module.js';

@Module({
  imports: [InstrumentsModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}