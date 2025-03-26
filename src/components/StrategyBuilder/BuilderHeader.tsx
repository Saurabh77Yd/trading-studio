import { FaSave, FaPaperPlane, FaHome } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { saveDraft, submitStrategy } from '../../store/strategySlice';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BuilderHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentStrategy, currentStep } = useAppSelector((state) => state.strategy);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'submitting' | 'submitted'>('idle');

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    dispatch(saveDraft());
    setSaveStatus('saved');
  };

  const handleSubmitStrategy = () => {
    setSaveStatus('submitting');
    dispatch(submitStrategy());
    setSaveStatus('submitted');
  };

  useEffect(() => {
    if (saveStatus === 'saved' || saveStatus === 'submitted') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, navigate]);

  // Disable submit button untill the Simulation page
  const isSubmitDisabled = currentStep !== 3 || 
                        saveStatus === 'submitting' || 
                        saveStatus === 'submitted';

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
      <Link 
        to="/" 
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <FaHome className="text-lg" />
        <span className="font-medium">Home</span>
      </Link>
      
      <div className="flex gap-2 items-center">
        {saveStatus === 'saved' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            Draft saved successfully!
          </div>
        )}
        
        {saveStatus === 'submitted' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            Strategy submitted successfully!
          </div>
        )}
        
        <button
          onClick={handleSaveDraft}
          className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
            saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={saveStatus === 'saving' || saveStatus === 'saved'}
        >
          {saveStatus === 'saving' ? 'Saving...' : (
            <>
              <FaSave /> Save Draft
            </>
          )}
        </button>
        
        <button
          onClick={handleSubmitStrategy}
          className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${
            isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitDisabled}
        >
          {saveStatus === 'submitting' ? 'Submitting...' : (
            <>
              <FaPaperPlane /> Submit Strategy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BuilderHeader;