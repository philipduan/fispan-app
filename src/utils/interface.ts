export interface Rates {
  [name: string]: number;
}

export interface LatestResponse {
  amount: number;
  base: string;
  date: Date | string;
  rates: Rates;
}

export interface TimeSeriesResponse {
  amount: number;
  base: string;
  date: Date | string;
  rates: Record<string, Rates>;
}