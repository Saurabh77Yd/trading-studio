export interface PortfolioConfig {
    initialCapital: number;
    riskPerTrade: number;
    maxPositions?: number;
  }
  
  export interface Rule {
    id: string;
    field: string;
    operator: string;
    value: number | string;
  }
  
  export type StrategyStatus = 'draft' | 'submitted' | 'simulated';
  
  export interface Strategy {
    id: string;
    name: string;
    scannerRules: Rule[];
    buyRules: Rule[];
    sellRules: Rule[];
    portfolioConfig: PortfolioConfig;
    status: StrategyStatus;
  }