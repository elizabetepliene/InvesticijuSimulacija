import { Controller, Get } from '@nestjs/common';
import { InstrumentsService } from './instruments.service.js';

@Controller('instruments')
export class InstrumentsController {
  constructor(
    private readonly instrumentsService: InstrumentsService,
  ) {}

  @Get()
  findAll() {
    return this.instrumentsService.findAll();
  }
}