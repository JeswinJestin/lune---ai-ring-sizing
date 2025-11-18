
import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { diameterToSize } from '../lib/sizeConversion';

interface ExistingRingSizerProps {
  onSubmit: (diameter: number) => void;
  onCancel: () => void;
}

const MIN_DIAMETER_MM = 13; // Approx US Size 2
const MAX_DIAMETER_MM = 23; // Approx US Size 14

export const ExistingRingSizer = ({ onSubmit, onCancel }: ExistingRingSizerProps) => {
  const [diameter, setDiameter] = useState<number>((MIN_DIAMETER_MM + MAX_DIAMETER_MM) / 2);

  const pixelsPerMm = 3.78; // Approximate, should be calibrated in a real app
  const circleSizePx = diameter * pixelsPerMm;
  
  const currentSize = useMemo(() => diameterToSize(diameter), [diameter]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center text-center animate-[fadeInUp_0.5s_ease-out]">
      <h2 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Measure Your Ring</h2>
      <p className="text-lg text-silver-400 mb-8 max-w-xl">Place a ring you own on the circle. Adjust the slider until the circle perfectly matches the inside edge of your ring.</p>
      
      <div className="w-full h-80 bg-midnight-500/50 rounded-2xl flex items-center justify-center my-8 relative border border-platinum-300/10">
        <div 
          className="rounded-full border-2 border-dashed border-bronze-400 bg-bronze-400/10 transition-all duration-75"
          style={{ width: `${circleSizePx}px`, height: `${circleSizePx}px` }}
        ></div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4 text-center">
            <div className="bg-midnight-700/80 backdrop-blur-sm p-2 rounded-lg inline-block">
                <p className="font-mono text-silver-100"><span className="font-bold">{diameter.toFixed(2)}</span> mm</p>
            </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <input
          type="range"
          min={MIN_DIAMETER_MM}
          max={MAX_DIAMETER_MM}
          step="0.1"
          value={diameter}
          onChange={(e) => setDiameter(parseFloat(e.target.value))}
          className="w-full h-2 bg-midnight-400 rounded-lg appearance-none cursor-pointer range-lg"
        />
        <div className="flex justify-between text-xs font-mono text-silver-400 mt-2 px-1">
          <span>{MIN_DIAMETER_MM}mm</span>
          <span>{MAX_DIAMETER_MM}mm</span>
        </div>
      </div>
        
      <div className="my-8 h-px w-full max-w-md bg-gradient-to-r from-transparent via-platinum-300/20 to-transparent"></div>

      {currentSize && (
        <div className="mb-8 font-mono">
            <p className="text-silver-400 uppercase tracking-widest text-sm">Estimated Size</p>
            <p className="text-4xl text-silver-50 font-bold">{`US ${currentSize.us} / UK ${currentSize.uk}`}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={() => onSubmit(diameter)} disabled={!currentSize}>Confirm Size</Button>
      </div>
    </div>
  );
};
