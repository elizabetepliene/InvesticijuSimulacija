import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { InstrumentsModule } from './instruments/instruments.module.js';

@Module({
  imports: [InstrumentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
