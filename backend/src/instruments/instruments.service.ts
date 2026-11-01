import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

type InstrumentDefinition = {
  symbol: string;
  name: string;
  type: 'STOCK' | 'ETF';
};

type FinnhubQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

@Injectable()
export class InstrumentsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  private readonly instruments: InstrumentDefinition[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'STOCK',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      type: 'STOCK',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      type: 'STOCK',
    },
  ];

  async findAll() {
    return Promise.all(
      this.instruments.map(async (instrument) => {
        const quote = await this.getQuote(
          instrument.symbol,
        );

        return {
          ...instrument,

          price: quote.c,

          changePercent: quote.dp,

          previousClose: quote.pc,

          dayHigh: quote.h,

          dayLow: quote.l,

          openPrice: quote.o,

          updatedAt: quote.t,
        };
      }),
    );
  }

  async findBySymbol(symbol: string) {
    const instrument = this.instruments.find(
      (item) =>
        item.symbol.toUpperCase() ===
        symbol.toUpperCase(),
    );

    if (!instrument) {
      return undefined;
    }

    const quote = await this.getQuote(
      instrument.symbol,
    );

    return {
      ...instrument,

      price: quote.c,

      changePercent: quote.dp,

      previousClose: quote.pc,

      dayHigh: quote.h,

      dayLow: quote.l,

      openPrice: quote.o,

      updatedAt: quote.t,
    };
  }

  private async getQuote(
    symbol: string,
  ): Promise<FinnhubQuote> {
    const apiKey =
      this.configService.get<string>(
        'FINNHUB_API_KEY',
      );

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'FINNHUB_API_KEY is not configured',
      );
    }

    const url =
      `https://finnhub.io/api/v1/quote` +
      `?symbol=${encodeURIComponent(symbol)}` +
      `&token=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Finnhub returned ${response.status}`,
        );
      }

      const quote =
        (await response.json()) as FinnhubQuote;

      if (
        typeof quote.c !== 'number' ||
        quote.c <= 0
      ) {
        throw new Error(
          `Invalid Finnhub quote for ${symbol}`,
        );
      }

      return quote;
    } catch {
      throw new ServiceUnavailableException(
        `Market data unavailable for ${symbol}`,
      );
    }
  }
}