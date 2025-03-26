import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addScannerRule, removeScannerRule } from '../../store/strategySlice';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Button from '../ui/Button';

const ScannerStep = () => {
  const dispatch = useAppDispatch();
  const { currentStrategy } = useAppSelector((state) => state.strategy);
  const [newRule, setNewRule] = useState<Omit<Rule, 'id'>>({
    field: 'price',
    operator: '>',
    value: ''
  });

  const handleAddRule = () => {
    if (newRule.value) {
      dispatch(addScannerRule({
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
    dispatch(removeScannerRule(id));
  };

  const availableFields = [
    { value: 'price', label: 'Price' },
    { value: 'volume', label: 'Volume' },
    { value: 'marketCap', label: 'Market Cap' },
    { value: 'peRatio', label: 'P/E Ratio' },
    { value: 'rsi', label: 'RSI (14)' },
    { value: 'sector', label: 'Sector' }
  ];

  const availableOperators = [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '=', label: '=' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' }
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Scanner Rules</h2>
        <p className="text-sm text-gray-600 mb-4">
          Define criteria to filter financial instruments
        </p>
        
        <div className="space-y-3">
          {currentStrategy.scannerRules.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No scanner rules added yet
            </div>
          ) : (
            currentStrategy.scannerRules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <select
                  className="flex-1 border rounded p-2 bg-white"
                  value={rule.field}
                  disabled
                >
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
                
                <select
                  className="flex-1 border rounded p-2 bg-white"
                  value={rule.operator}
                  disabled
                >
                  {availableOperators.map((op) => (
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

        <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded">
          <select
            className="flex-1 border rounded p-2"
            value={newRule.field}
            onChange={(e) => setNewRule({...newRule, field: e.target.value})}
          >
            {availableFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          
          <select
            className="flex-1 border rounded p-2"
            value={newRule.operator}
            onChange={(e) => setNewRule({...newRule, operator: e.target.value})}
          >
            {availableOperators.map((op) => (
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

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Scanner rules determine which instruments will be considered for your strategy.
              Add multiple rules to narrow down your selection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerStep;