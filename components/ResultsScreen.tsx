
import React, { useEffect, useState } from 'react';
import type { MeasurementResult } from '../types';
import { Button } from './Button';
import { DownloadIcon, SparklesIcon } from './icons/UtilIcons';
import { generateMeasurementReport } from '../lib/pdf-generator';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  result: MeasurementResult;
  onMeasureAgain: () => void;
  onTryOn: () => void;
  onViewRecommendations: () => void;
  onMultiFingerSizing?: () => void;
}

export const ResultsScreen = ({ result, onMeasureAgain, onTryOn, onViewRecommendations, onMultiFingerSizing }: ResultsScreenProps) => {
  const { ringSize, confidence, fingerCircumference_mm, fingerDiameter_mm } = result;
  const [displayedSize, setDisplayedSize] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti if confidence is high
    if (confidence > 80 && !showConfetti) {
      setShowConfetti(true);
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [confidence, showConfetti]);

  // Count up animation for the numeric part of US size (if it's a number)
  useEffect(() => {
    const targetSize = parseFloat(String(ringSize.us));
    if (isNaN(targetSize)) {
      // If not a number (e.g. "S", "M"), just set it
      return;
    }

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);

      const current = start + (targetSize - start) * ease;
      setDisplayedSize(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [ringSize.us]);


  const getConfidenceDetails = () => {
    if (confidence >= 90) {
      return { level: 'Excellent', color: 'from-emerald-400 to-emerald-600', textColor: 'text-emerald-400' };
    } else if (confidence >= 75) {
      return { level: 'Good', color: 'from-amber-400 to-amber-600', textColor: 'text-amber-400' };
    } else {
      return { level: 'Fair', color: 'from-rose-400 to-rose-600', textColor: 'text-rose-400' };
    }
  };

  const { level: confidenceLevel, color: confidenceColor, textColor } = getConfidenceDetails();

  const handleDownloadReport = () => {
    try {
      generateMeasurementReport(result);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const displayUSSize = isNaN(parseFloat(String(ringSize.us))) ? ringSize.us : displayedSize.toFixed(1);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 text-center animate-[fadeInUp_0.5s_ease-out]">
      <div className="relative bg-midnight-500/50 backdrop-blur-lg border border-platinum-300/10 rounded-3xl shadow-2xl p-8 sm:p-12 overflow-hidden">
        {/* Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b ${confidence >= 90 ? 'from-emerald-500/20' : 'from-indigo-500/20'} to-transparent rounded-full blur-3xl -z-10 pointer-events-none`}></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <SparklesIcon className="w-4 h-4 text-bronze-400" />
          <span className="text-xs font-medium text-silver-300 uppercase tracking-wider">AI Analysis Complete</span>
        </div>

        <h2 className="font-display text-3xl text-white mb-2">Your Perfect Fit</h2>

        <div className="relative py-8">
          <p className="font-display text-[5rem] sm:text-[7rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-silver-200 to-silver-500 font-light tracking-tighter">
            {displayUSSize}
          </p>
          <p className="text-silver-400 text-lg font-medium mt-2">US Size</p>
        </div>

        <div className="max-w-md mx-auto mt-4 px-4 sm:px-8">
          <div className="flex justify-between items-center mb-2 text-sm font-medium">
            <span className={`${textColor} flex items-center gap-2`}>
              <span className={`w-2 h-2 rounded-full bg-current animate-pulse`}></span>
              {confidenceLevel} Confidence
            </span>
            <span className="font-mono text-silver-300">{confidence}%</span>
          </div>
          <div className="w-full bg-midnight-900/50 rounded-full h-2 p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${confidenceColor} shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
              role="progressbar"
            ></div>
          </div>
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-silver-300 font-mono">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-[10px] text-silver-400 uppercase tracking-wider mb-1">UK Size</div>
            <div className="text-2xl font-medium text-white">{ringSize.uk}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-[10px] text-silver-400 uppercase tracking-wider mb-1">EU Size</div>
            <div className="text-2xl font-medium text-white">{ringSize.eu}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-[10px] text-silver-400 uppercase tracking-wider mb-1">Diameter</div>
            <div className="text-2xl font-medium text-white">{fingerDiameter_mm.toFixed(1)}<span className="text-sm ml-0.5 text-silver-500">mm</span></div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-[10px] text-silver-400 uppercase tracking-wider mb-1">Circumference</div>
            <div className="text-2xl font-medium text-white">{fingerCircumference_mm.toFixed(1)}<span className="text-sm ml-0.5 text-silver-500">mm</span></div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Button onClick={onTryOn} variant="primary" className="w-full shadow-[0_0_20px_rgba(201,166,104,0.3)]">
            <SparklesIcon className="inline-block mr-2 h-5 w-5" />
            Try On (AR)
          </Button>

          <Button onClick={onViewRecommendations} variant="secondary" className="w-full">
            View Styles
          </Button>

          {onMultiFingerSizing && (
            <Button onClick={onMultiFingerSizing} variant="secondary" className="w-full sm:col-span-2 lg:col-span-1">
              👆 Multi-Finger
            </Button>
          )}

          <Button onClick={handleDownloadReport} variant="ghost" className="w-full border border-white/10 hover:bg-white/5">
            <DownloadIcon className="inline-block mr-2 h-5 w-5" />
            Download
          </Button>

          <Button onClick={onMeasureAgain} variant="ghost" className="w-full border border-white/10 hover:bg-white/5">
            Measure Again
          </Button>
        </div>
      </div>
    </div>
  );
};
