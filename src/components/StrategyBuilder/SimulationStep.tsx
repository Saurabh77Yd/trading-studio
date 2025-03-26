import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { FaChartLine, FaCoins, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import Button from '../ui/Button';

const SimulationStep = () => {
  const { currentStrategy } = useAppSelector((state) => state.strategy);
  const portfolioConfig = currentStrategy.portfolioConfig;
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // simulation with random but realistic value
    setTimeout(() => {
      const results = {
        totalReturn: (Math.random() * 30 - 5).toFixed(1), 
        annualizedReturn: (Math.random() * 40 - 5).toFixed(1), 
        maxDrawdown: (Math.random() * -15).toFixed(1), 
        winRate: (Math.random() * 50 + 30).toFixed(1), 
        sharpeRatio: (Math.random() * 2).toFixed(2), 
        tradesExecuted: Math.floor(Math.random() * 200), 
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      };
      
      setSimulationResults(results);
      setIsSimulating(false);
    }, 1500); // 1.5 second delay to simulate API call
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Portfolio Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <FaCoins className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Initial Capital</p>
              <p className="font-medium">${portfolioConfig.initialCapital.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <FaPercentage className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Risk Per Trade</p>
              <p className="font-medium">{portfolioConfig.riskPerTrade}%</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <FaChartLine className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Max Positions</p>
              <p className="font-medium">{portfolioConfig.maxPositions || 10}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <FaCalendarAlt className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">Backtest Period</p>
              <p className="font-medium">1 Year (Default)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={runSimulation}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
            disabled={isSimulating}
          >
            {isSimulating ? (
              'Running Simulation...'
            ) : (
              <>
                <FaChartLine className="mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </div>
      </div>

      {simulationResults && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Simulation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Total Return</p>
              <p className={`text-2xl font-bold ${
                parseFloat(simulationResults.totalReturn) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(simulationResults.totalReturn) >= 0 ? '+' : ''}
                {simulationResults.totalReturn}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Annualized Return</p>
              <p className={`text-2xl font-bold ${
                parseFloat(simulationResults.annualizedReturn) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(simulationResults.annualizedReturn) >= 0 ? '+' : ''}
                {simulationResults.annualizedReturn}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-600">
                {simulationResults.maxDrawdown}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Win Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {simulationResults.winRate}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-green-600">
                {simulationResults.sharpeRatio}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Trades Executed</p>
              <p className="text-2xl font-bold text-gray-700">
                {simulationResults.tradesExecuted}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Simulation Period: {simulationResults.startDate} to {simulationResults.endDate}</p>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Simulation Notes</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>• Past performance does not guarantee future results</p>
              <p>• Consider running multiple time periods for robustness</p>
              <p>• Review trades in detail before live implementation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationStep;