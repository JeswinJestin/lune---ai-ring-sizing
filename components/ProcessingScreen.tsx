
import React, { useState, useEffect } from 'react';
import type { SizingMethod } from '../types';

interface ProcessingScreenProps {
  method: SizingMethod | null;
}

const analysisSteps: Record<SizingMethod, string[]> = {
  'credit-card': [
    "Detecting card edges...",
    "Calibrating pixel-to-mm ratio...",
    "Isolating finger from background...",
    "Measuring finger width at knuckle...",
    "Finalizing measurement..."
  ],
  'ai-scan': [
    "Detecting hand landmarks...",
    "Analyzing hand geometry...",
    "Calibrating from palm geometry...",
    "Calculating finger-to-knuckle ratios...",
    "Cross-referencing sizing database...",
    "Finalizing measurement..."
  ],
  'existing-ring': [
    "Analyzing diameter...",
    "Calculating circumference...",
    "Matching to size chart..."
  ],
  'phone-screen': [
    "Accessing device dimensions...",
    "Calibrating screen reference...",
    "Estimating finger size..."
  ],
  'printable': [], // Not applicable
};

export const ProcessingScreen = ({ method }: ProcessingScreenProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = method ? analysisSteps[method] : ["Processing your measurement..."];
  
  useEffect(() => {
    if (steps.length <= 1) return;

    const interval = setInterval(() => {
      setStepIndex(prevIndex => {
        if (prevIndex < steps.length - 1) {
          return prevIndex + 1;
        }
        clearInterval(interval);
        return prevIndex;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-[fadeInUp_0.5s_ease-out]">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-platinum-300/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-platinum-300 rounded-full animate-spin"></div>
      </div>
      <h2 className="font-display text-4xl text-silver-100 mb-4">Analyzing your perfect fit...</h2>
      <div className="text-silver-400 max-w-md h-12 transition-opacity duration-500">
        <p key={steps[stepIndex]}>{steps[stepIndex]}</p>
      </div>
    </div>
  );
};
