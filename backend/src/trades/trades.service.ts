import { BadRequestException, Injectable } from '@nestjs/common';

type InstrumentPriceMap = Record<string, number>;

@Injectable()
export class TradesService {
  private cash = 3724.18;

  private positions: Record<string, number> = {
    VWCE: 22,
    AAPL: 8,
    NVDA: 11,
  };

  private averagePurchasePrices: Record<string, number> = {
    VWCE: 128.0,
    AAPL: 195.0,
    NVDA: 105.0,
  };

  buy(symbol: string, quantity: number, price: number) {
    if (!symbol || quantity <= 0 || price <= 0) {
      throw new BadRequestException('Invalid trade data');
    }

    const total = quantity * price;

    if (total > this.cash) {
      throw new BadRequestException('Insufficient virtual cash');
    }

    const currentQuantity = this.positions[symbol] ?? 0;
    const currentAveragePrice =
      this.averagePurchasePrices[symbol] ?? price;

    const currentCost =
      currentQuantity * currentAveragePrice;

    const newQuantity =
      currentQuantity + quantity;

    const newAveragePrice =
      (currentCost + total) / newQuantity;

    this.cash -= total;

    this.positions[symbol] = newQuantity;
    this.averagePurchasePrices[symbol] = newAveragePrice;

    return {
      success: true,
      symbol,
      quantity,
      price,
      total: Number(total.toFixed(2)),
      remainingCash: Number(this.cash.toFixed(2)),
      positionQuantity: newQuantity,
      averagePurchasePrice: Number(
        newAveragePrice.toFixed(2),
      ),
    };
  }

  sell(symbol: string, quantity: number, price: number) {
  if (!symbol || quantity <= 0 || price <= 0) {
    throw new BadRequestException('Invalid trade data');
  }

  const currentQuantity = this.positions[symbol] ?? 0;

  if (currentQuantity <= 0) {
    throw new BadRequestException(
      'Instrument is not in portfolio',
    );
  }

  if (quantity > currentQuantity) {
    throw new BadRequestException(
      'Insufficient position quantity',
    );
  }

  const averagePurchasePrice =
    this.averagePurchasePrices[symbol] ?? price;

  const total = quantity * price;

  const realizedProfitLoss =
    (price - averagePurchasePrice) * quantity;

  const remainingQuantity =
    currentQuantity - quantity;

  this.cash += total;

  if (remainingQuantity === 0) {
    delete this.positions[symbol];
    delete this.averagePurchasePrices[symbol];
  } else {
    this.positions[symbol] = remainingQuantity;
  }

  return {
    success: true,
    symbol,
    quantity,
    price: Number(price.toFixed(2)),
    total: Number(total.toFixed(2)),
    realizedProfitLoss: Number(
      realizedProfitLoss.toFixed(2),
    ),
    remainingCash: Number(this.cash.toFixed(2)),
    remainingQuantity,
  };
}

  getPortfolio(prices: InstrumentPriceMap) {
    const positions = Object.entries(this.positions).map(
      ([symbol, quantity]) => {
        const currentPrice = prices[symbol] ?? 0;

        const averagePurchasePrice =
          this.averagePurchasePrices[symbol] ?? currentPrice;

        const marketValue =
          quantity * currentPrice;

        const investedCost =
          quantity * averagePurchasePrice;

        const profitLoss =
          marketValue - investedCost;

        const profitLossPercent =
          investedCost > 0
            ? (profitLoss / investedCost) * 100
            : 0;

        return {
          symbol,
          quantity,
          currentPrice: Number(currentPrice.toFixed(2)),
          averagePurchasePrice: Number(
            averagePurchasePrice.toFixed(2),
          ),
          marketValue: Number(marketValue.toFixed(2)),
          investedCost: Number(investedCost.toFixed(2)),
          profitLoss: Number(profitLoss.toFixed(2)),
          profitLossPercent: Number(
            profitLossPercent.toFixed(2),
          ),
        };
      },
    );

    const investedValue = positions.reduce(
      (sum, position) =>
        sum + position.marketValue,
      0,
    );

    const totalCost = positions.reduce(
      (sum, position) =>
        sum + position.investedCost,
      0,
    );

    const totalProfitLoss =
      investedValue - totalCost;

    const totalProfitLossPercent =
      totalCost > 0
        ? (totalProfitLoss / totalCost) * 100
        : 0;

    const positionsWithConcentration =
      positions.map((position) => {
        const concentrationPercent =
          investedValue > 0
            ? (position.marketValue /
                investedValue) *
              100
            : 0;

        return {
          ...position,
          concentrationPercent: Number(
            concentrationPercent.toFixed(2),
          ),
        };
      });

    const highestConcentration =
      positionsWithConcentration.reduce(
        (highest, position) =>
          Math.max(
            highest,
            position.concentrationPercent,
          ),
        0,
      );

    const riskLevel =
      highestConcentration > 70
        ? 'HIGH'
        : 'NORMAL';

    return {
      cash: Number(this.cash.toFixed(2)),

      investedValue: Number(
        investedValue.toFixed(2),
      ),

      totalValue: Number(
        (this.cash + investedValue).toFixed(2),
      ),

      totalProfitLoss: Number(
        totalProfitLoss.toFixed(2),
      ),

      totalProfitLossPercent: Number(
        totalProfitLossPercent.toFixed(2),
      ),

      highestConcentration: Number(
        highestConcentration.toFixed(2),
      ),

      riskLevel,

      positions: positionsWithConcentration,
    };
  }
}