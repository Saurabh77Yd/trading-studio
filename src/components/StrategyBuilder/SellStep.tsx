import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addSellRule, removeSellRule } from '../../store/strategySlice';
import { FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';
import Button from '../ui/Button';

const SellStep = () => {
  const dispatch = useAppDispatch();
  const { currentStrategy } = useAppSelector((state) => state.strategy);
  const [newRule, setNewRule] = useState<Omit<Rule, 'id'>>({
    field: 'price',
    operator: '<',
    value: ''
  });

  const handleAddRule = () => {
    if (newRule.value) {
      dispatch(addSellRule({
        ...newRule,
        id: Date.now().toString(),
        value: Number(newRule.value) || newRule.value
      }));
      setNewRule({
        field: 'price',
        operator: '<',
        value: ''
      });
    }
  };

  const handleRemoveRule = (id: string) => {
    dispatch(removeSellRule(id));
  };

  const sellConditions = [
    { value: 'price', label: 'Price' },
    { value: 'profitPercentage', label: 'Profit %' },
    { value: 'lossPercentage', label: 'Loss %' },
    { value: 'rsi', label: 'RSI' },
    { value: 'volume', label: 'Volume' },
    { value: 'time', label: 'Time Held' }
  ];

  const operators = [
    { value: '<', label: 'Less than' },
    { value: '>', label: 'Greater than' },
    { value: '=', label: 'Equals' },
    { value: '<=', label: 'Less than or equal' },
    { value: '>=', label: 'Greater than or equal' }
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Sell Conditions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Define when to sell positions from your portfolio
        </p>

        <div className="space-y-3 mb-4">
          {currentStrategy.sellRules.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No sell conditions added yet
            </div>
          ) : (
            currentStrategy.sellRules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <select
                  className="flex-1 border rounded p-2 bg-white"
                  value={rule.field}
                  disabled
                >
                  {sellConditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>

                <select
                  className="flex-1 border rounded p-2 bg-white"
                  value={rule.operator}
                  disabled
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="flex-1 border rounded p-2 bg-white"
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
            ))
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
          <select
            className="flex-1 border rounded p-2"
            value={newRule.field}
            onChange={(e) => setNewRule({...newRule, field: e.target.value})}
          >
            {sellConditions.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>

          <select
            className="flex-1 border rounded p-2"
            value={newRule.operator}
            onChange={(e) => setNewRule({...newRule, operator: e.target.value})}
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
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
            disabled={!newRule.value}
          >
            <FaPlus />
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex items-start">
          <FaInfoCircle className="flex-shrink-0 mt-1 text-blue-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Sell Condition Tips</h3>
            <ul className="mt-1 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Use price targets to take profits or cut losses</li>
              <li>Set percentage-based rules for consistent risk management</li>
              <li>Combine multiple conditions for complex exit strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellStep;