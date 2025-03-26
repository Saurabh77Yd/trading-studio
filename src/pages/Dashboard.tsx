import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { FaPlus, FaEdit, FaPlay, FaSpinner, FaChartLine, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { duplicateStrategy } from '../store/strategySlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { savedStrategies } = useAppSelector((state) => state.strategy);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<Record<string, any>>({});

  const handleSimulate = (strategyId: string) => {
    setSimulatingId(strategyId);
    
    setTimeout(() => {
      const mockResults = {
        totalReturn: (Math.random() * 30 - 5).toFixed(1) + '%',
        annualizedReturn: (Math.random() * 40 - 5).toFixed(1) + '%',
        winRate: (Math.random() * 50 + 30).toFixed(1) + '%',
        tradesExecuted: Math.floor(Math.random() * 200),
        date: new Date().toLocaleString()
      };
      
      setSimulationResults(prev => ({
        ...prev,
        [strategyId]: mockResults
      }));
      setSimulatingId(null);
    }, 1500);
  };

  const handleCopyStrategy = (strategyId: string) => {
    dispatch(duplicateStrategy(strategyId));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Strategies</h1>
        <Link
          to="/builder"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          <FaPlus /> Create New Strategy
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        {savedStrategies.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No strategies found. Create your first strategy!
          </div>
        ) : (
          savedStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white h-full flex flex-col"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold truncate max-w-[180px]">
                  {strategy.name}
                </h2>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  strategy.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {strategy.status}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 space-y-1 flex-grow">
                <p>Scanner Rules: {strategy.scannerRules.length}</p>
                <p>Buy Rules: {strategy.buyRules.length}</p>
                <p>Sell Rules: {strategy.sellRules.length}</p>
                {strategy.portfolioConfig && (
                  <p>Capital: ${strategy.portfolioConfig.initialCapital.toLocaleString()}</p>
                )}
              </div>

              {simulationResults[strategy.id] && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <FaChartLine className="text-sm" />
                    <span className="text-xs font-medium">Last Simulation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Return: <span className="font-medium">{simulationResults[strategy.id].totalReturn}</span></div>
                    <div>Win Rate: <span className="font-medium">{simulationResults[strategy.id].winRate}</span></div>
                    <div>Trades: <span className="font-medium">{simulationResults[strategy.id].tradesExecuted}</span></div>
                    <div>Date: <span className="font-medium">{simulationResults[strategy.id].date}</span></div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                <Link
                  to={`/builder?strategyId=${strategy.id}`}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                >
                  <FaEdit size={14} /> Edit
                </Link> 
                
                <button
                  onClick={() => handleSimulate(strategy.id)}
                  disabled={simulatingId === strategy.id}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors disabled:opacity-50"
                >
                  {simulatingId === strategy.id ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} /> Simulating...
                    </>
                  ) : (
                    <>
                      <FaPlay size={14} /> Simulate
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyStrategy(strategy.id)}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                >
                  <FaCopy size={14} /> Copy
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;