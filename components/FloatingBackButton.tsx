
import React from 'react';
import { ChevronLeftIcon } from './icons/UtilIcons';

interface FloatingBackButtonProps {
  onBack: () => void;
}

export const FloatingBackButton = ({ onBack }: FloatingBackButtonProps) => {
  return (
    <button 
      onClick={onBack} 
      className="fixed top-24 left-4 md:left-8 z-[60] w-12 h-12 rounded-full bg-midnight-400/60 backdrop-blur-xl border border-platinum-300/20 flex items-center justify-center text-silver-300 transition-all duration-300 hover:border-platinum-300/40 hover:bg-midnight-400/80 hover:scale-110 active:scale-95"
      aria-label="Go back"
    >
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
  );
};
