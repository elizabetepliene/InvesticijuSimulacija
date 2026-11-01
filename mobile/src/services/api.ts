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
    throw new Error(data.message ?? 'Pirkumu neizdevās veikt');
  }

  return data;
}