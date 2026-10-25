import { Injectable } from '@nestjs/common';

@Injectable()
export class InstrumentsService {
  private readonly instruments = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'STOCK',
      price: 207.42,
      changePercent: 1.28,
    },
    {
      symbol: 'VWCE',
      name: 'Vanguard FTSE All-World',
      type: 'ETF',
      price: 136.18,
      changePercent: 0.54,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      type: 'STOCK',
      price: 389.76,
      changePercent: -0.41,
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      type: 'STOCK',
      price: 112.88,
      changePercent: 2.64,
    },
  ];

  findAll() {
    return this.instruments;
  }
}