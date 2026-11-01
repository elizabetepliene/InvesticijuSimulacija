import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TradesService {
  private cash = 3724.18;

  private positions: Record<string, number> = {
    VWCE: 22,
    AAPL: 8,
    NVDA: 11,
  };

  buy(symbol: string, quantity: number, price: number) {
    if (!symbol || quantity <= 0 || price <= 0) {
      throw new BadRequestException('Invalid trade data');
    }

    const total = quantity * price;

    if (total > this.cash) {
      throw new BadRequestException('Insufficient virtual cash');
    }

    this.cash -= total;

    this.positions[symbol] =
      (this.positions[symbol] ?? 0) + quantity;

    return {
      success: true,
      symbol,
      quantity,
      price,
      total,
      remainingCash: Number(this.cash.toFixed(2)),
      positionQuantity: this.positions[symbol],
    };
  }

  getPortfolio() {
    return {
      cash: Number(this.cash.toFixed(2)),
      positions: this.positions,
    };
  }
}