import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentStep, validateCurrentStep } from '../../store/strategySlice';
import { useEffect } from 'react';

const steps = ['Scanner', 'Buy', 'Sell', 'Simulation'];

const StepNavigation = () => {
  const dispatch = useAppDispatch();
  const { currentStep, validation } = useAppSelector((state) => state.strategy);

  // Validate current step whenever it changes
  useEffect(() => {
    dispatch(validateCurrentStep());
  }, [currentStep, dispatch]);

  const isNextDisabled = () => {
    switch(currentStep) {
      case 0: return !validation.isScannerValid;
      case 1: return !validation.isBuyValid;
      case 2: return !validation.isSellValid;
      case 3: return !validation.isSimulationValid;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!isNextDisabled()) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
      <button
        onClick={handleBack}
        disabled={currentStep === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        <HiArrowLeft /> Back
      </button>
      
      <div className="flex gap-4">
        {steps.map((step, index) => (
          <div 
            key={step}
            className={`flex items-center gap-2 ${
              currentStep === index 
                ? 'font-bold text-blue-600' 
                : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-500'
            }`}
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
              currentStep === index
                ? 'bg-blue-100 text-blue-600'
                : index < currentStep
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {index + 1}
            </span>
            {step}
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentStep === steps.length - 1 || isNextDisabled()}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          currentStep === steps.length - 1 || isNextDisabled()
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        Next <HiArrowRight />
      </button>
    </div>
  );
};

export default StepNavigation;