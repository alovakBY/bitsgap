export type OrderSide = 'buy' | 'sell';

export interface ProfitTarget {
  id: string;
  hasError: boolean;
  profit: number;
  targetPrice: number;
  amount: number;
}

export type ProfitTargetInputs = Exclude<keyof ProfitTarget, 'id' | 'hasError'>;
