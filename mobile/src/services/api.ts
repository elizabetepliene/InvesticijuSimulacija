export type Instrument = {
  symbol: string;
  name: string;
  type: 'STOCK' | 'ETF';
  price: number;
  changePercent: number;
};

const API_URL = 'http://localhost:3000';

export async function getInstruments(): Promise<Instrument[]> {
  const response = await fetch(`${API_URL}/instruments`);

  if (!response.ok) {
    throw new Error('Neizdevās ielādēt instrumentus');
  }

  return response.json();
}

export type BuyTradeRequest = {
  symbol: string;
  quantity: number;
  price: number;
};

export type BuyTradeResponse = {
  success: boolean;
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  remainingCash: number;
  positionQuantity: number;
  averagePurchasePrice?: number;
};

export async function buyInstrument(
  trade: BuyTradeRequest,
): Promise<BuyTradeResponse> {
  const response = await fetch(`${API_URL}/trades/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trade),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? 'Pirkumu neizdevās veikt',
    );
  }

  return data;
}

export type PortfolioPosition = {
  symbol: string;
  quantity: number;
  currentPrice: number;
  averagePurchasePrice: number;
  marketValue: number;
  investedCost: number;
  profitLoss: number;
  profitLossPercent: number;
  concentrationPercent: number;
};

export type PortfolioResponse = {
  cash: number;
  investedValue: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  highestConcentration: number;
  riskLevel: 'HIGH' | 'NORMAL';
  positions: PortfolioPosition[];
};

export async function getPortfolio(): Promise<PortfolioResponse> {
  const response = await fetch(
    `${API_URL}/trades/portfolio`,
  );

  if (!response.ok) {
    throw new Error(
      'Neizdevās ielādēt portfeli',
    );
  }

  return response.json();
}

export type SellTradeRequest = {
  symbol: string;
  quantity: number;
  price: number;
};

export type SellTradeResponse = {
  success: boolean;
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  realizedProfitLoss: number;
  remainingCash: number;
  remainingQuantity: number;
};

export async function sellInstrument(
  trade: SellTradeRequest,
): Promise<SellTradeResponse> {
  const response = await fetch(`${API_URL}/trades/sell`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trade),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? 'Pārdošanu neizdevās veikt',
    );
  }

  return data;
}

export type TradeHistoryItem = {
  id: number;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  realizedProfitLoss?: number;
  createdAt: string;
};

export async function getTradeHistory(): Promise<TradeHistoryItem[]> {
  const response = await fetch(`${API_URL}/trades/history`);

  if (!response.ok) {
    throw new Error('Neizdevās ielādēt darījumu vēsturi');
  }

  return response.json();
}