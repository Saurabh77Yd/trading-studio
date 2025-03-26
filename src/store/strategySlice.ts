import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Strategy, Rule, PortfolioConfig } from '../types/strategy';

interface ValidationState {
  isScannerValid: boolean;
  isBuyValid: boolean;
  isSellValid: boolean;
  isSimulationValid: boolean;
}

interface StrategyState {
  currentStrategy: Strategy;
  savedStrategies: Strategy[];
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  validation: ValidationState;
}

const initialState: StrategyState = {
  currentStrategy: {
    id: '',
    name: 'New Strategy',
    scannerRules: [],
    buyRules: [],
    sellRules: [],
    portfolioConfig: {
      initialCapital: 10000,
      riskPerTrade: 2,
      maxPositions: 10
    },
    status: 'draft'
  },
  savedStrategies: [],
  currentStep: 0,
  isLoading: false,
  error: null,
  validation: {
    isScannerValid: false,
    isBuyValid: false,
    isSellValid: false,
    isSimulationValid: false
  }
};

const strategySlice = createSlice({
  name: 'strategy',
  initialState,
  reducers: {
    // Strategy CRUD operations
    updateStrategy: (state, action: PayloadAction<Partial<Strategy>>) => {
      state.currentStrategy = { ...state.currentStrategy, ...action.payload };
    },
    
    // Scanner Rules
    addScannerRule: (state, action: PayloadAction<Rule>) => {
      state.currentStrategy.scannerRules.push(action.payload);
      state.validation.isScannerValid = state.currentStrategy.scannerRules.length > 0;
    },
    removeScannerRule: (state, action: PayloadAction<string>) => {
      state.currentStrategy.scannerRules = state.currentStrategy.scannerRules.filter(
        rule => rule.id !== action.payload
      );
      state.validation.isScannerValid = state.currentStrategy.scannerRules.length > 0;
    },
    
    // Buy Rules
    addBuyRule: (state, action: PayloadAction<Rule>) => {
      state.currentStrategy.buyRules.push(action.payload);
      state.validation.isBuyValid = state.currentStrategy.buyRules.length > 0;
    },
    removeBuyRule: (state, action: PayloadAction<string>) => {
      state.currentStrategy.buyRules = state.currentStrategy.buyRules.filter(
        rule => rule.id !== action.payload
      );
      state.validation.isBuyValid = state.currentStrategy.buyRules.length > 0;
    },
    
    // Sell Rules
    addSellRule: (state, action: PayloadAction<Rule>) => {
      state.currentStrategy.sellRules.push(action.payload);
      state.validation.isSellValid = state.currentStrategy.sellRules.length > 0;
    },
    removeSellRule: (state, action: PayloadAction<string>) => {
      state.currentStrategy.sellRules = state.currentStrategy.sellRules.filter(
        rule => rule.id !== action.payload
      );
      state.validation.isSellValid = state.currentStrategy.sellRules.length > 0;
    },
    
    // Portfolio Configuration
    updatePortfolioConfig: (state, action: PayloadAction<Partial<PortfolioConfig>>) => {
      state.currentStrategy.portfolioConfig = {
        ...state.currentStrategy.portfolioConfig,
        ...action.payload
      };
      state.validation.isSimulationValid = 
        state.currentStrategy.portfolioConfig.initialCapital > 0 &&
        state.currentStrategy.portfolioConfig.riskPerTrade > 0 &&
        state.currentStrategy.portfolioConfig.maxPositions > 0;
    },
    
    // Step Navigation
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    validateCurrentStep: (state) => {
      switch(state.currentStep) {
        case 0: // Scanner
          state.validation.isScannerValid = state.currentStrategy.scannerRules.length > 0;
          break;
        case 1: // Buy
          state.validation.isBuyValid = state.currentStrategy.buyRules.length > 0;
          break;
        case 2: // Sell
          state.validation.isSellValid = state.currentStrategy.sellRules.length > 0;
          break;
        case 3: // Simulation
          state.validation.isSimulationValid = 
            state.currentStrategy.portfolioConfig.initialCapital > 0 &&
            state.currentStrategy.portfolioConfig.riskPerTrade > 0 &&
            state.currentStrategy.portfolioConfig.maxPositions > 0;
          break;
      }
    },
    
    // Save/Submit operations
    saveDraft: (state) => {
      const existingIndex = state.savedStrategies.findIndex(
        (s) => s.id === state.currentStrategy.id
      );

      const draft = {
        ...state.currentStrategy,
        status: 'draft' as const,
        updatedAt: new Date().toISOString(),
      };

      if (!draft.id) {
        draft.id = Date.now().toString();
        draft.createdAt = new Date().toISOString();
      }

      if (existingIndex >= 0) {
        state.savedStrategies[existingIndex] = draft;
      } else {
        state.savedStrategies.push(draft);
      }
    },
    submitStrategy: (state) => {
      const submittedStrategy = {
        ...state.currentStrategy,
        status: 'submitted' as const,
        updatedAt: new Date().toISOString(),
      };

      if (!submittedStrategy.id) {
        submittedStrategy.id = Date.now().toString();
        submittedStrategy.createdAt = new Date().toISOString();
      }

      state.savedStrategies = [
        ...state.savedStrategies.filter((s) => s.id !== submittedStrategy.id),
        submittedStrategy,
      ];
    },
    
    // Strategy management
    loadStrategy: (state, action: PayloadAction<string>) => {
      const strategy = state.savedStrategies.find(s => s.id === action.payload);
      if (strategy) {
        state.currentStrategy = strategy;
        // Validate all steps when loading a strategy
        state.validation = {
          isScannerValid: strategy.scannerRules.length > 0,
          isBuyValid: strategy.buyRules.length > 0,
          isSellValid: strategy.sellRules.length > 0,
          isSimulationValid: 
            strategy.portfolioConfig.initialCapital > 0 &&
            strategy.portfolioConfig.riskPerTrade > 0 &&
            strategy.portfolioConfig.maxPositions > 0
        };
        state.error = null;
      } else {
        state.error = 'Strategy not found';
      }
    },
    resetStrategy: (state) => {
      state.currentStrategy = {
        id: '',
        name: 'New Strategy',
        scannerRules: [],
        buyRules: [],
        sellRules: [],
        portfolioConfig: {
          initialCapital: 10000,
          riskPerTrade: 2,
          maxPositions: 10
        },
        status: 'draft'
      };
      state.currentStep = 0;
      state.error = null;
      state.validation = {
        isScannerValid: false,
        isBuyValid: false,
        isSellValid: false,
        isSimulationValid: false
      };
    },
    deleteStrategy: (state, action: PayloadAction<string>) => {
      state.savedStrategies = state.savedStrategies.filter(
        strategy => strategy.id !== action.payload
      );
    },
    //Copy any strategy 
    duplicateStrategy: (state, action: PayloadAction<string>) => {
      const strategyToCopy = state.savedStrategies.find(s => s.id === action.payload);
      if (strategyToCopy) {
        const newStrategy = {
          ...strategyToCopy,
          id: Date.now().toString(), // New unique ID
          name: `${strategyToCopy.name} (Copy)`, // Append "Copy" to the name
          status: 'draft' as const, // Reset status to draft
          createdAt: new Date().toISOString(), // New creation time
          updatedAt: new Date().toISOString(), // New update time
        };
        state.savedStrategies.push(newStrategy);
      }
    },
    
    // Utility functions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  updateStrategy,
  addScannerRule,
  removeScannerRule,
  addBuyRule,
  removeBuyRule,
  addSellRule,
  removeSellRule,
  updatePortfolioConfig,
  setCurrentStep,
  validateCurrentStep,
  saveDraft,
  submitStrategy,
  loadStrategy,
  resetStrategy,
  deleteStrategy,
  setLoading,
  setError,
  duplicateStrategy,
} = strategySlice.actions;

export default strategySlice.reducer;
