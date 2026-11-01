import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { TradesService } from './trades.service.js';
import { InstrumentsService } from '../instruments/instruments.service.js';

@Controller('trades')
export class TradesController {
  constructor(
    private readonly tradesService: TradesService,
    private readonly instrumentsService: InstrumentsService,
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

  @Post('sell')
sell(
  @Body()
  body: {
    symbol: string;
    quantity: number;
    price: number;
  },
) {
  return this.tradesService.sell(
    body.symbol,
    body.quantity,
    body.price,
  );
}

@Get('history')
getHistory() {
  return this.tradesService.getHistory();
}

  @Get('portfolio')
  getPortfolio() {
    const instruments =
      this.instrumentsService.findAll();

    const prices = Object.fromEntries(
      instruments.map((instrument) => [
        instrument.symbol,
        instrument.price,
      ]),
    );

    return this.tradesService.getPortfolio(
      prices,
    );
  }
}