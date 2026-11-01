import { Body, Controller, Get, Post } from '@nestjs/common';
import { TradesService } from './trades.service.js';

@Controller('trades')
export class TradesController {
  constructor(
    private readonly tradesService: TradesService,
  ) {}

  @Post('buy')
  buy(
    @Body()
    body: {
      symbol: string;
      quantity: number;
      price: number;
    },
  ) {
    return this.tradesService.buy(
      body.symbol,
      body.quantity,
      body.price,
    );
  }

  @Get('portfolio')
  getPortfolio() {
    return this.tradesService.getPortfolio();
  }
}