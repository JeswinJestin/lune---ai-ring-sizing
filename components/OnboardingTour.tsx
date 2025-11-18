
import React, { useState, useLayoutEffect } from 'react';
import { Button } from './Button';
import { CloseIcon } from './icons/UtilIcons';

export interface TourStep {
  targetSelector: string | null;
  title: string;
  content: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isActive: boolean;
}

export const OnboardingTour = ({ steps, currentStepIndex, onNext, onPrev, onSkip, isActive }: OnboardingTourProps): React.ReactElement | null => {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  
  const currentStep = steps[currentStepIndex];

  useLayoutEffect(() => {
    if (!isActive || !currentStep.targetSelector) {
      setHighlightRect(null);
      return;
    }

    const timer = setTimeout(() => {
        const element = document.querySelector(currentStep.targetSelector!);
        if (element) {
            setHighlightRect(element.getBoundingClientRect());
        } else {
            setHighlightRect(null);
        }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep.targetSelector, currentStepIndex, isActive]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!isActive || !currentStep.targetSelector) return;
      const element = document.querySelector(currentStep.targetSelector!);
      if (element) {
        setHighlightRect(element.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep.targetSelector, isActive]);
  
  if (!isActive) {
    return null;
  }

  const tooltipStyle: React.CSSProperties = {};
  if (highlightRect) {
    tooltipStyle.position = 'absolute';
    tooltipStyle.top = highlightRect.bottom + 16;
    tooltipStyle.left = highlightRect.left + highlightRect.width / 2;
    tooltipStyle.transform = 'translateX(-50%)';
    
    if (highlightRect.bottom + 300 > window.innerHeight) {
        tooltipStyle.top = 'auto';
        tooltipStyle.bottom = window.innerHeight - highlightRect.top + 16;
        tooltipStyle.transform = 'translateX(-50%)';
    }
     if (highlightRect.left + 160 > window.innerWidth) { // 160 is half of tooltip width (320px)
        tooltipStyle.left = 'auto';
        tooltipStyle.right = 8;
        tooltipStyle.transform = 'translateX(0)';
    }
    if (highlightRect.left - 160 < 0) {
        tooltipStyle.left = 8;
        tooltipStyle.transform = 'translateX(0)';
    }
  } else {
    tooltipStyle.position = 'fixed';
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  const highlightStyle: React.CSSProperties = highlightRect
    ? {
        position: 'absolute',
        top: `${highlightRect.top - 8}px`,
        left: `${highlightRect.left - 8}px`,
        width: `${highlightRect.width + 16}px`,
        height: `${highlightRect.height + 16}px`,
        boxShadow: '0 0 0 9999px rgba(13, 13, 18, 0.7)',
        border: '2px solid #C9A668',
        borderRadius: '12px',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'none',
      }
    : {
        pointerEvents: 'none',
    };

  return (
    <div className="fixed inset-0 z-[1000] animate-[fadeIn_0.3s_ease-out]">
      {!highlightRect && <div className="absolute inset-0 bg-midnight-800/70 backdrop-blur-sm"></div>}
      <div style={highlightStyle}></div>

      <div
        style={tooltipStyle}
        className="z-[1001] w-80 max-w-[90vw] bg-midnight-500 rounded-2xl border border-platinum-300/20 shadow-2xl p-6 animate-[fadeInUp_0.4s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 id="tour-title" className="text-xl font-display text-silver-100">{currentStep.title}</h3>
                <span className="text-sm font-mono text-silver-400" aria-label={`Step ${currentStepIndex + 1} of ${steps.length}`}>{currentStepIndex + 1} / {steps.length}</span>
            </div>
            <button onClick={onSkip} className="text-silver-400 hover:text-silver-100 transition-colors" aria-label="Close tour">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        <p id="tour-content" className="text-silver-300 mb-6">{currentStep.content}</p>

        <div className="flex justify-between items-center">
            <Button onClick={onPrev} variant="ghost" disabled={currentStepIndex === 0}>
                Previous
            </Button>
            <Button onClick={onNext} variant="primary">
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </div>
      </div>
    </div>
  );
};
