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