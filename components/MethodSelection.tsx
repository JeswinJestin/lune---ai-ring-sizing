
import React from 'react';
import { Card } from './Card';
import { CreditCardIcon, HandIcon, RingIcon, RulerIcon } from './icons/MethodIcons';
import { SparklesIcon } from './icons/UtilIcons';
import type { SizingMethod } from '../types';

interface MethodSelectionProps {
  onMethodSelect: (method: SizingMethod) => void;
}

export const MethodSelection = ({ onMethodSelect }: MethodSelectionProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-center animate-[fadeInUp_0.5s_ease-out]">
      <h2 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Find Your Perfect Fit</h2>
      <p className="text-lg text-silver-400 mb-12 max-w-2xl mx-auto">We offer multiple ways to find your accurate ring size. Choose the most convenient method for you.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card onClick={() => onMethodSelect('credit-card')} id="method-credit-card">
          <div className="relative">
             <span className="absolute -top-6 -right-4 bg-bronze-400 text-silver-50 text-xs font-bold px-3 py-1 rounded-full">MOST ACCURATE</span>
             <CreditCardIcon className="mx-auto mb-4 h-16 w-16 text-bronze-400"/>
             <h3 className="text-xl font-semibold text-silver-200 mb-2">Use a Credit Card</h3>
             <p className="text-silver-400 text-sm">Use your camera and any standard-sized card for a precise, AI-powered measurement.</p>
          </div>
        </Card>
        <Card onClick={() => onMethodSelect('ai-scan')} id="method-ai-scan">
            <div>
                <HandIcon className="mx-auto mb-4 h-16 w-16 text-bronze-400"/>
                <h3 className="text-xl font-semibold text-silver-200 mb-2">AI Finger Scan</h3>
                <p className="text-silver-400 text-sm">Use just your camera. Our AI analyzes your hand to predict your size—no card needed.</p>
            </div>
        </Card>
        <Card onClick={() => onMethodSelect('existing-ring')}>
           <RingIcon className="mx-auto mb-4 h-16 w-16 text-bronze-400"/>
           <h3 className="text-xl font-semibold text-silver-200 mb-2">Measure an Existing Ring</h3>
           <p className="text-silver-400 text-sm">Have a ring that fits well? Measure its inner diameter on your screen.</p>
        </Card>
         <Card onClick={() => onMethodSelect('printable')}>
           <RulerIcon className="mx-auto mb-4 h-16 w-16 text-bronze-400"/>
           <h3 className="text-xl font-semibold text-silver-200 mb-2">Printable Sizer</h3>
           <p className="text-silver-400 text-sm">For a hands-on approach, download and print our accurate ring sizing guide.</p>
        </Card>
        <Card disabled={true}>
          <div className="relative">
             <span className="absolute -top-6 -right-4 bg-midnight-400 text-silver-200 text-xs font-bold px-3 py-1 rounded-full">COMING SOON</span>
             <SparklesIcon className="mx-auto mb-4 h-16 w-16 text-silver-500"/>
             <h3 className="text-xl font-semibold text-silver-400 mb-2">AR Virtual Try-On</h3>
             <p className="text-silver-500 text-sm">Available after a successful measurement. Visualize rings on your actual hand!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
