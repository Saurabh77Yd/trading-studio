import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addBuyRule, removeBuyRule, updatePortfolioConfig } from '../../store/strategySlice';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Button from '../ui/Button';

const BuyStep = () => {
  const dispatch = useAppDispatch();
  const { currentStrategy } = useAppSelector((state) => state.strategy);
  const [newRule, setNewRule] = useState<Omit<Rule, 'id'>>({
    field: 'price',
    operator: '>',
    value: ''
  });

  const handleAddRule = () => {
    if (newRule.value) {
      dispatch(addBuyRule({
        ...newRule,
        id: Date.now().toString(),
        value: Number(newRule.value) || newRule.value
      }));
      setNewRule({
        field: 'price',
        operator: '>',
        value: ''
      });
    }
  };

  const handleRemoveRule = (id: string) => {
    dispatch(removeBuyRule(id));
  };

  const handlePortfolioConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updatePortfolioConfig({
      [name]: Number(value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Buy Rules</h2>
        
        <div className="space-y-4">
          {currentStrategy.buyRules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
              <select
                className="flex-1 border rounded p-2"
                value={rule.field}
                disabled
              >
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="rsi">RSI</option>
              </select>
              
              <select
                className="flex-1 border rounded p-2"
                value={rule.operator}
                disabled
              >
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value="=">{'='}</option>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
              </select>
              
              <input
                type="text"
                className="flex-1 border rounded p-2"
                value={rule.value}
                disabled
              />
              
              <Button 
                onClick={() => handleRemoveRule(rule.id)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <FaTrash />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded">
          <select
            className="flex-1 border rounded p-2"
            value={newRule.field}
            onChange={(e) => setNewRule({...newRule, field: e.target.value})}
          >
            <option value="price">Price</option>
            <option value="volume">Volume</option>
            <option value="rsi">RSI</option>
          </select>
          
          <select
            className="flex-1 border rounded p-2"
            value={newRule.operator}
            onChange={(e) => setNewRule({...newRule, operator: e.target.value})}
          >
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="=">{'='}</option>
            <option value=">=">{'>='}</option>
            <option value="<=">{'<='}</option>
          </select>
          
          <input
            type="text"
            className="flex-1 border rounded p-2"
            value={newRule.value}
            onChange={(e) => setNewRule({...newRule, value: e.target.value})}
            placeholder="Value"
          />
          
          <Button 
            onClick={handleAddRule}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <FaPlus />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Portfolio Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Capital ($)
            </label>
            <input
              type="number"
              name="initialCapital"
              value={currentStrategy.portfolioConfig.initialCapital}
              onChange={handlePortfolioConfigChange}
              className="w-full border rounded p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk per Trade (%)
            </label>
            <input
              type="number"
              name="riskPerTrade"
              value={currentStrategy.portfolioConfig.riskPerTrade}
              onChange={handlePortfolioConfigChange}
              className="w-full border rounded p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Positions
            </label>
            <input
              type="number"
              name="maxPositions"
              value={currentStrategy.portfolioConfig.maxPositions || 10}
              onChange={handlePortfolioConfigChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyStep;