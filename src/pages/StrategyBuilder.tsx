import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useParams, useSearchParams } from 'react-router-dom';
import { loadStrategy, resetStrategy } from '../store/strategySlice';
import BuilderHeader from '../components/StrategyBuilder/BuilderHeader';
import StepNavigation from '../components/StrategyBuilder/StepNavigation';
import ScannerStep from '../components/StrategyBuilder/ScannerStep';
import BuyStep from '../components/StrategyBuilder/BuyStep';
import SellStep from '../components/StrategyBuilder/SellStep';
import SimulationStep from '../components/StrategyBuilder/SimulationStep';

const StrategyBuilder = () => {
  const dispatch = useAppDispatch();
  const { currentStep, currentStrategy } = useAppSelector((state) => state.strategy);
  const [searchParams] = useSearchParams();
  const strategyId = searchParams.get('strategyId');

  useEffect(() => {
    if (strategyId) {
      dispatch(loadStrategy(strategyId));
    } else {
      dispatch(resetStrategy());
    }
  }, [strategyId, dispatch]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ScannerStep />;
      case 1:
        return <BuyStep />;
      case 2:
        return <SellStep />;
      case 3:
        return <SimulationStep />;
      default:
        return <ScannerStep />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BuilderHeader />
      
      <div className="flex-1 p-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </div>

      <StepNavigation />
    </div>
  );
};

export default StrategyBuilder;

